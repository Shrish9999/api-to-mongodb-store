const Product = require('../models/productModel');

exports.getAllProducts = async (req, res) => {
    try {
        const allProducts = await Product.find(); 
        res.status(200).json(allProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.addProduct = async (req, res) => {
    try {
        const productData = { ...req.body };
        
        
        if (req.file) {
            productData.thumbnail = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        const updateData = { ...req.body };

        
        if (req.file) {
            updateData.thumbnail = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};