const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- Multer Setup (Image Upload ke liye) ---
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

// ==========================================
// NEW ROUTE: DATA MIGRATION (Seed)
// ==========================================
// Sabse pehle isse hit karna hai: http://localhost:5000/api/products/seed
router.get('/products/seed', productController.seedProducts);


// ==========================================
// EXISTING ROUTES
// ==========================================

// 1. Get All Products
router.get('/products', productController.getAllProducts);

// 2. Dashboard Stats
// Isse /api/stats par access kiya jayega
router.get('/stats', productController.getDashboardStats); 

// 3. Add, Update, Delete Operations
router.post('/products', upload.single('thumbnail'), productController.addProduct); 
router.put('/products/:id', upload.single('thumbnail'), productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;