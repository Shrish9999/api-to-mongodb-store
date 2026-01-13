const express = require('express');
const router = express.Router();
const { getOffers, createOffer, deleteOffer } = require('../controllers/offerController');

// Routes define karo
router.get('/', getOffers);          // Offer list lene ke liye
router.post('/', createOffer);       // Naya offer banane ke liye
router.delete('/:id', deleteOffer);  // Offer delete karne ke liye

module.exports = router;