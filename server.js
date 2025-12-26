const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection (Apne connection string ka use karein)
mongoose.connect('mongodb://127.0.0.1:27017/shopDB')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Connection error", err));

// 1. Product Schema (DummyJSON ke structure ke hisaab se)
const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    category: String,
    thumbnail: String,
    rating: Number,
    stock: Number
});

const Product = mongoose.model('Product', productSchema);

// 2. Route: API se data lekar DB mein save karna
app.get('/import-products', async (req, res) => {
    try {
        const response = await axios.get('https://dummyjson.com/products');
        const products = response.data.products; // DummyJSON mein 'products' array hota hai

        // Purana data clear karke naya save karne ke liye (Optional)
        await Product.deleteMany({}); 

        // Database mein save karein
        await Product.insertMany(products);
        
        res.status(200).json({ message: "Data successfully imported to Database!", count: products.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Route: Database se saara data fetch karke frontend ko bhejna
app.get('/api/products', async (req, res) => {
    try {
        const allProducts = await Product.find();
        res.json(allProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));