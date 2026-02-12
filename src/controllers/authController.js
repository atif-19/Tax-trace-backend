const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to create JWT
const generateToken = (id) => { // we use user id  and pass it  as payload to generate the token
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        // fetch  name email etc from req.body
        const { name, email, password, monthlyIncome } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            monthlyIncome
        });

        // send status 201 as user is created
        res.status(201).json({
            _id: user._id,
            name: user.name,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try { 
        // extract email and password from req.body
        const { email,password } = req.body;

        // Check for user (include password because we set 'select: false' in model)
        const user = await User.findOne({ email }).select('+password');
        // if user exists and password match then generate token and send it to user
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                token: generateToken(user._id)
            });
        } else {// invalid
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) { // any error occured
        res.status(500).json({ message: error.message });
    }
};