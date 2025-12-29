const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect('mongodb://127.0.0.1:27017/shopDB')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error(err));

// Routes use karna
app.use('/api', productRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));