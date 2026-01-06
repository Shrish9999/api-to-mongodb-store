const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Logic
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body; // role bhi le sakte hain testing ke liye
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already registered!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role: role || 'user' });
        await newUser.save();
        res.status(201).json({ message: "Account created successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Server Error. Try again later." });
    }
};

// Login Logic
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found!" });

        // Check if user is blocked
        if (user.isBlocked) {
            return res.status(403).json({ error: "Your account is blocked by Admin!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid Credentials!" });

        const token = jwt.sign({ id: user._id, role: user.role }, 'secret_key', { expiresIn: '1d' });
        
        res.json({ 
            token, 
            user: { name: user.name, role: user.role, email: user.email } 
        });
    } catch (err) {
        res.status(500).json({ error: "Login failed on server." });
    }
};

// --- ADMIN FEATURES (Naya Add Kiya) ---

// Saare users fetch karne ke liye
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Password chhupa kar baki sab dikhao
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

// User ko block/unblock karne ke liye
exports.toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({ message: `User ${user.isBlocked ? 'Blocked' : 'Unblocked'} successfully!` });
    } catch (err) {
        res.status(500).json({ error: "Failed to update user status" });
    }
};

// User delete karne ke liye
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete user" });
    }
};