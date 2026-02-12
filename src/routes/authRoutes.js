const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Define the endpoints and link them to controllers
router.post('/register', register);
router.post('/login', login);

module.exports = router;