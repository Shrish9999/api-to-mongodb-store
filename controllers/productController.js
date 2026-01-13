const Product = require('../models/productModel');
const axios = require('axios'); // <-- Yeh line zaroori hai data fetch karne ke liye

// 1. Get All Products
exports.getAllProducts = async (req, res) => {
    try {
        const allProducts = await Product.find(); 
        res.status(200).json(allProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Add New Product
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

// 3. Update Product
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

// 4. Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Advanced Dashboard Stats (Updated Feature)
exports.getDashboardStats = async (req, res) => {
    try {
        // Category wise counts
        const categoryStats = await Product.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        // Category wise stock
        const stockStats = await Product.aggregate([
            { $group: { _id: "$category", totalStock: { $sum: "$stock" } } }
        ]);

        // Summary calculations
        const totalProducts = await Product.countDocuments();
        const inventoryValue = await Product.aggregate([
            { $group: { _id: null, totalValue: { $sum: { $multiply: ["$price", "$stock"] } } } }
        ]);

        // SMART MOVE: Fetching Low Stock & Recent Items for a Professional Look
        const lowStockItems = await Product.find({ stock: { $lt: 20 } }).limit(5).select('title stock thumbnail');
        const recentActivity = await Product.find().sort({ _id: -1 }).limit(5).select('title category createdAt');

        res.status(200).json({
            categoryData: categoryStats.map(item => ({ name: item._id || "Others", value: item.count })),
            stockData: stockStats.map(item => ({ name: item._id || "Others", stock: item.totalStock })),
            summary: {
                totalProducts,
                totalValue: inventoryValue[0]?.totalValue || 0,
                totalCategories: categoryStats.length,
                lowStockCount: lowStockItems.length
            },
            lowStockItems,
            recentActivity
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 6. Seed Products (NEW API FEATURE: Fetch 194 items & Reset DB)
exports.seedProducts = async (req, res) => {
    try {
        console.log("Fetching data from DummyJSON...");
        // API se data mangwana
        const response = await axios.get('https://dummyjson.com/products?limit=194');
        const apiData = response.data.products;

        console.log("Deleting old data...");
        // Purana data delete karna
        await Product.deleteMany({});

        // Naye data ko map karna taaki schema ke saath fit baithe
        const productDocs = apiData.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            category: item.category,
            thumbnail: item.thumbnail,
            rating: item.rating,
            stock: item.stock
        }));

        console.log("Inserting new data...");
        // Naya data save karna
        await Product.insertMany(productDocs);

        console.log("Data Imported Successfully!");
        res.status(201).json({ 
            message: 'Database Seeded Successfully! Old data cleared.', 
            count: productDocs.length, 
            products: productDocs 
        });

    } catch (error) {
        console.error("Error seeding data:", error);
        res.status(500).json({ message: "Server Error during Seeding", error: error.message });
    }
};