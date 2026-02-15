const express = require('express');
const router = express.Router();
const { createScan,getScanHistory } = require('../controllers/scanController');
const { protect } = require('../middleware/authMiddleware');


router.post('/', protect, createScan);
router.get('/history', protect, getScanHistory);
module.exports = router;