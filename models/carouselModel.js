const mongoose = require('mongoose');

const carouselSchema = mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: false // Caption optional rakha hai
    },
    description: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Carousel', carouselSchema);