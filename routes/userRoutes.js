const express = require('express');
const router = express.Router();
const { updateUserProfile } = require('../controllers/userController'); // Nayi file se import
const { protect } = require('../middleware/authMiddleware'); // Auth check ke liye

// PUT Request for Profile Update
router.put('/profile', protect, updateUserProfile);

module.exports = router;