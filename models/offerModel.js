const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  }, // e.g. "Diwali Dhamaka"
  
  code: { 
    type: String, 
    required: true, 
    unique: true 
  }, // e.g. "DIWALI50"
  
  discount: { 
    type: Number, 
    required: true 
  }, // e.g. 50 (%)
  
  expiryDate: { 
    type: Date, 
    required: true 
  },
  
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);