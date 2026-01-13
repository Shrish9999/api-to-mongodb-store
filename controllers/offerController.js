const Offer = require('../models/offerModel');

// 1. Get All Offers (Jo naye hain wo pehle aayenge)
const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Create New Offer
const createOffer = async (req, res) => {
  const { title, code, discount, expiryDate } = req.body;
  
  try {
    // Check agar duplicate code hai
    const existingOffer = await Offer.findOne({ code });
    if (existingOffer) {
        return res.status(400).json({ message: "Offer code already exists!" });
    }

    const newOffer = new Offer({ title, code, discount, expiryDate });
    const savedOffer = await newOffer.save();
    res.status(201).json(savedOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 3. Delete Offer
const deleteOffer = async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: "Offer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOffers, createOffer, deleteOffer };