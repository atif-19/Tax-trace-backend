const express = require('express');
const router = express.Router();
const { getDailySummary, getMonthlySummary } = require('../controllers/summaryController'); // Import both
const { protect } = require('../middleware/authMiddleware');

router.get('/daily', protect, getDailySummary);
router.get('/monthly', protect, getMonthlySummary); // New route
module.exports = router;