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

module.exports = mongoose.model('Product', productSchema);