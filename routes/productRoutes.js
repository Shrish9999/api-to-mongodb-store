const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        // Unique filename: CurrentTime + Extension
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

router.get('/products', productController.getAllProducts);

// 'thumbnail' file input ka name hona chahiye
router.post('/products', upload.single('thumbnail'), productController.addProduct); 
router.put('/products/:id', upload.single('thumbnail'), productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;