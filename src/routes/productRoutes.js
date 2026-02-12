const express = require('express');
const router = express.Router();
const { lookupProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// We protect this because only logged-in users should use our API units
router.post('/lookup', protect, lookupProduct);

module.exports = router;