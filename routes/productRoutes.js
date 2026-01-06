const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


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

router.get('/products', productController.getAllProducts);


router.post('/products', upload.single('thumbnail'), productController.addProduct); 
router.put('/products/:id', upload.single('thumbnail'), productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;