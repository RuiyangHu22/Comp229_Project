const express = require('express');
const crypto = require('crypto');
const User = require('../models/user');

const router = express.Router();

// Function to generate secure token
function generateToken() {
    return crypto.randomBytes(24).toString('hex');
}

// In-memory store for tokens (you can use Redis or another database for production)
const tokens = {};

// Register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(400).json({ message: 'Error registering user', error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !user.validatePassword(password)) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = generateToken();
        tokens[token] = user._id; // Associate token with user ID
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
});

// Logout
router.post('/logout', (req, res) => {
    const { token } = req.body;

    if (tokens[token]) {
        delete tokens[token];
        res.json({ message: 'Logged out successfully' });
    } else {
        res.status(400).json({ message: 'Invalid token' });
    }
});

module.exports = router;