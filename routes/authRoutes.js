const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getAllUsers,       
    toggleBlockUser,   
    deleteUser,        
    forgotPassword,    
    resetPassword      
} = require('../controllers/authController');

// Debug Middleware for this file only
router.use((req, res, next) => {
    console.log(`🔎 Auth Route ke andar aaya: ${req.url}`);
    next();
});

// --- MAIN ROUTES ---

// Dhyan de: Yahan sirf '/' ya '/login' likhna hai. 
// Kyunki server.js mein pehle hi '/api/auth' laga diya hai.

router.post('/register', register);

router.post('/login', (req, res, next) => {
    console.log("🎯 Auth Route Hit: Login Handler chalu");
    login(req, res, next);
});

// --- ADMIN ROUTES ---
router.get('/users', getAllUsers);
router.put('/users/block/:id', toggleBlockUser);
router.delete('/users/:id', deleteUser);

// --- FORGOT PASSWORD ---
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);

module.exports = router;