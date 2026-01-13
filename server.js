require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// ==========================================
// 1. MIDDLEWARES (Sabse Pehle Aayenge)
// ==========================================

// CORS: Sabko allow karo (3000, 3001, etc.)
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Body Parsers (Data padhne ke liye)
app.use(express.json({ limit: '50mb' })); // Agar badi file/image ho toh crash na ho
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request Logger (Tujhe dikhega kaun pukaar raha hai)
app.use((req, res, next) => {
    console.log(`📡 Request: [${req.method}] ${req.url}`);
    next();
});

// ==========================================
// 2. STATIC FILES (Images ke liye)
// ==========================================
// Ye line API routes se PEHLE honi chahiye ya ALAG honi chahiye
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// 3. DATABASE CONNECTION
// ==========================================
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopDB';
mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        // Database fail hone par bhi server chalne do, crash mat karo
    });

// ==========================================
// 4. API ROUTES (Dynamic Logic)
// ==========================================

// Product Routes
try {
    const productRoutes = require('./routes/productRoutes');
    app.use('/api', productRoutes);
    console.log("✅ Product Routes Loaded");
} catch (error) {
    console.error("⚠️ Warning: Product Routes missing");
}

// Auth Routes (Login, Register, Admin)
try {
    const authRoutes = require('./routes/authRoutes');
    // Note: Is file ke andar router.post('/login') hai, 
    // toh full URL banega: /api/auth/login
    app.use('/api/auth', authRoutes);
    console.log("✅ Auth Routes Loaded");
} catch (error) {
    console.error("⚠️ Warning: Auth Routes missing");
}

// OFFER ROUTES
try {
    const offerRoutes = require('./routes/offerRoutes');
    app.use('/api/offers', offerRoutes);
    console.log("✅ Offer Routes Loaded");
} catch (error) {
    console.error("⚠️ Warning: Offer Routes missing");
}

// CAROUSEL ROUTES
try {
    const carouselRoutes = require('./routes/carouselRoutes');
    app.use('/api/carousel', carouselRoutes);
    console.log("✅ Carousel Routes Loaded");
} catch (error) {
    console.error("⚠️ Warning: Carousel Routes missing");
}

// ORDER ROUTES (NEW ADDED HERE) 👇
try {
    const orderRoutes = require('./routes/orderRoutes');
    app.use('/api/orders', orderRoutes);
    console.log("✅ Order Routes Loaded");
} catch (error) {
    console.error("⚠️ Warning: Order Routes missing");
}

// Admin Controller Direct Functions (Legacy Support)
try {
    const authController = require('./controllers/authController');
    app.get('/api/admin/users', authController.getAllUsers);
    app.put('/api/admin/block/:id', authController.toggleBlockUser);
    app.delete('/api/admin/user/:id', authController.deleteUser);
} catch (error) {
    console.log("⚠️ Legacy Admin Routes skipped");
}

// ==========================================
// 5. TEST ROUTE (Check karne ke liye)
// ==========================================
app.get('/', (req, res) => {
    res.send("🚀 Server is Running Perfectly!");
});

// ==========================================
// 6. ERROR HANDLING (Crash Guard)
// ==========================================

// Agar koi Rasta (Route) na mile
app.use((req, res, next) => {
    console.log(`❌ 404 Error: Route ${req.url} not found`);
    res.status(404).json({ error: "API Route not found" });
});

// GLOBAL ERROR HANDLER (Server Crash hone se bachayega)
app.use((err, req, res, next) => {
    console.error("🔥 SERVER ERROR:", err.stack); // Terminal mein error dikhao
    res.status(500).json({ 
        error: "Internal Server Error", 
        details: err.message 
    });
});

// ==========================================
// 7. START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on port: ${PORT}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api/auth/login`);
});