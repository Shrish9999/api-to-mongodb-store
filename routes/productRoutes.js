const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Jab koi '/api/products' pe aaye, toh controller ka function chalao
router.get('/products', productController.getAllProducts);

module.exports = router;