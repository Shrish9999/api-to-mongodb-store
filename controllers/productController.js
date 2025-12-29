const Product = require('../models/productModel');

// Saare products DB se nikalne ke liye
exports.getAllProducts = async (req, res) => {
    try {
        const allProducts = await Product.find(); // DB se saara data laya
        res.status(200).json(allProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Agar kabhi naya data refresh karna ho (optional logic)
exports.importProducts = async (req, res) => {
    // Ye tabhi use karein agar DB khali ho jaye
    res.status(200).json({ message: "Data already in DB!" });
};