const Carousel = require('../models/carouselModel');
const fs = require('fs');
const path = require('path');

// 1. Get All Banners (Frontend par dikhane ke liye)
const getBanners = async (req, res) => {
    try {
        const banners = await Carousel.find({});
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Add New Banner (Admin ke liye)
const addBanner = async (req, res) => {
    try {
        const { title, description } = req.body;
        
        // Check if image is uploaded
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image" });
        }

        // Image path (Multer se aayega)
        const imagePath = `/uploads/${req.file.filename}`;

        const newBanner = new Carousel({
            title,
            description,
            image: imagePath
        });

        const savedBanner = await newBanner.save();
        res.status(201).json(savedBanner);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Delete Banner
const deleteBanner = async (req, res) => {
    try {
        const banner = await Carousel.findById(req.params.id);
        
        if (banner) {
            // Server ke folder se image delete karo (Optional par acha hota hai)
            const filePath = path.join(__dirname, '..', banner.image); 
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            // Database se delete karo
            await banner.deleteOne();
            res.json({ message: 'Banner removed' });
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getBanners, addBanner, deleteBanner };