const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getBanners, addBanner, deleteBanner } = require('../controllers/carouselController');

// Multer Config (Images save karne ke liye)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Uploads folder mein jayega
    },
    filename: (req, file, cb) => {
        // Unique naam: banner-date-originalName
        cb(null, 'banner-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes
router.get('/', getBanners);
router.post('/', upload.single('image'), addBanner); // 'image' field name hoga form data mein
router.delete('/:id', deleteBanner);

module.exports = router;