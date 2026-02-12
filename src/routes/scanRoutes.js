const express = require('express');
const router = express.Router();
const { createScan } = require('../controllers/scanController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createScan);

module.exports = router;