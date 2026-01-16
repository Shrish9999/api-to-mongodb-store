const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    category: String,
    thumbnail: String,
    rating: Number,
    stock: Number,
    
    // 👇 YEH FIELD MISSING THA, ISLIYE ERROR AA RAHA THA
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer', // Yeh tumhare Offer model ke naam se match hona chahiye
        default: null
    }
});

module.exports = mongoose.model('Product', productSchema);