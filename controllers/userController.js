const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// @desc    Update user profile (Name, Email, Password)
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    try {
        // req.user._id humein middleware (protect) se milega
        const user = await User.findById(req.user._id);

        if (user) {
            // Name aur Email update karo (agar user ne bheja hai, nahi toh purana rakho)
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            // Password tabhi update karo agar user ne naya password bheja ho
            if (req.body.password) {
                // Password hash karna zaroori hai
                user.password = await bcrypt.hash(req.body.password, 10);
            }

            // Database mein save karo
            const updatedUser = await user.save();

            // Naya data wapas bhejo (Password hata ke)
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                // Token hum frontend pe wahi purana use kar lenge, 
                // ya chahein toh naya generate kar sakte hain, par abhi simple rakhte hain.
            });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ error: "Server Error: " + error.message });
    }
};
