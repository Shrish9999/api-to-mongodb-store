const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const authController = require('./controllers/authController'); // Controller import kiya

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://127.0.0.1:27017/shopDB')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error(err));

// Routes
app.use('/api', productRoutes);
app.use('/api/auth', authRoutes);

// --- ADMIN API ENDPOINTS ---
app.get('/api/admin/users', authController.getAllUsers);
app.put('/api/admin/block/:id', authController.toggleBlockUser);
app.delete('/api/admin/user/:id', authController.deleteUser);

app.listen(5000, () => console.log("Server running on port 5000"));