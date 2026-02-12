const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
// Middleware
app.use(express.json()); // Allows us to receive JSON data in requests
app.use(cors());         // Allows cross-origin requests
app.use(morgan('dev'));  // Logs requests to the console

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);
const scanRoutes = require('./routes/scanRoutes');
app.use('/api/scans', scanRoutes);
const summaryRoutes = require('./routes/summaryRoutes');
app.use('/api/summary', summaryRoutes);


// Basic Health Check Route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to TaxTrace API V1" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});


module.exports = app;