const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // roles: 'user', 'manager', 'superadmin'
    role: { type: String, default: 'user' }, 
    isBlocked: { type: Boolean, default: false },

    // --- Naya Add Kiya (Password Reset ke liye) ---
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

module.exports = mongoose.model('User', userSchema);