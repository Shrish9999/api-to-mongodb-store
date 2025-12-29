const mongoose = require('mongoose');

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

// "Product" naam ka model export kar rahe hain jo 'products' collection se judega
module.exports = mongoose.model('Product', productSchema);