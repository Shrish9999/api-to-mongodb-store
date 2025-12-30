const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Add this
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Images ko access karne ke liye uploads folder ko static banaya
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://127.0.0.1:27017/shopDB')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error(err));

app.use('/api', productRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));