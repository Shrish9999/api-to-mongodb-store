const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// --- 1. LOGIN CONTROLLER (Fixed & Non-Blocking) ---
exports.login = async (req, res) => {
    console.log("🔹 1. Login Function Started");
    
    try {
        const { email, password } = req.body;
        console.log("🔹 2. Email received:", email);

        // Step A: Check User in DB
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log("❌ User nahi mila DB mein");
            return res.status(404).json({ error: "User not found! Please register first." });
        }
        console.log("✅ User Mil gaya:", user.name);

        // Step B: Check Block Status
        if (user.isBlocked) {
            console.log("❌ User Blocked hai");
            return res.status(403).json({ error: "Access Denied. Your account is blocked." });
        }

        // Step C: Check Password
        console.log("🔹 3. Comparing Password...");
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            console.log("❌ Password Galat hai");
            return res.status(401).json({ error: "Invalid Email or Password!" });
        }
        console.log("✅ Password Sahi hai");

        // Step D: Generate Token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'secret_key', 
            { expiresIn: '1d' }
        );

        console.log("🚀 Login Successful! Sending Data...");
        
        // Final Response
        return res.status(200).json({ 
            success: true,
            token, 
            user: { 
                name: user.name, 
                email: user.email, 
                role: user.role 
            } 
        });

    } catch (err) {
        console.error("🔥 LOGIN CRASH ERROR:", err);
        return res.status(500).json({ error: "Server Error: " + err.message });
    }
};

// --- 2. REGISTER CONTROLLER ---
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role: role || 'user' });
        await newUser.save();
        
        res.status(201).json({ message: "Account created! Please Login." });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};

// --- 3. FORGOT PASSWORD ---
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        const resetUrl = `http://localhost:3001/password/reset/${resetToken}`;
        
        // Nodemailer Setup
        const transporter = nodemailer.createTransport({
            service: process.env.SMPT_SERVICE,
            auth: { user: process.env.SMPT_MAIL, pass: process.env.SMPT_PASSWORD },
        });

        await transporter.sendMail({
            from: process.env.SMPT_MAIL,
            to: user.email,
            subject: "Password Reset Request",
            html: `<a href="${resetUrl}">Click here to reset password</a>`
        });

        res.status(200).json({ message: "Email Sent Successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Email could not be sent" });
    }
};

// --- 4. RESET PASSWORD ---
exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ error: "Invalid/Expired Token" });
        if (req.body.password !== req.body.confirmPassword) return res.status(400).json({ error: "Passwords mismatch" });

        user.password = await bcrypt.hash(req.body.password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: "Password Updated!" });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

// --- ADMIN HELPERS ---
exports.getAllUsers = async (req, res) => {
    try { const users = await User.find().select('-password'); res.json(users); } catch (e) { res.status(500).json({error: "Error"}); }
};
exports.toggleBlockUser = async (req, res) => {
    try { const u = await User.findById(req.params.id); u.isBlocked = !u.isBlocked; await u.save(); res.json({message: "Updated"}); } catch (e) { res.status(500).json({error: "Error"}); }
};
exports.deleteUser = async (req, res) => {
    try { await User.findByIdAndDelete(req.params.id); res.json({message: "Deleted"}); } catch (e) { res.status(500).json({error: "Error"}); }
};