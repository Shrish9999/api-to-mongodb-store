// backend/createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel'); // Path check kar lena

const createSuperAdmin = async () => {
    try {
        // 1. DB Connect
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopDB');
        console.log("✅ DB Connected");

        // 2. Purana fake admin delete karo (agar hai)
        await User.findOneAndDelete({ email: "admin@gmail.com" });

        // 3. Naya Original Admin banao
        const hashedPassword = await bcrypt.hash("123456", 10);
        
        const admin = new User({
            name: "Super Boss",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "superadmin",
            isBlocked: false
        });

        await admin.save();
        console.log("🎉 SUPER ADMIN CREATED SUCCESSFULLY!");
        console.log("📧 Email: admin@gmail.com");
        console.log("🔑 Pass: 123456");

        process.exit();
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

createSuperAdmin();