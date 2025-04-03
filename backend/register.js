const express = require('express');
const db = require('./db'); // Ensure correct path
const router = express.Router();

// Handle user registration
router.post('/', (req, res) => {
    const { username, password, confirmPassword } = req.body;

    // Check if all fields are provided
    if (!username || !password || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check if user already exists
    const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(checkUserQuery, [username], (err, results) => {
        if (err) {
            console.error('❌ Database Error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length > 0) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        // Insert new user into database
        const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(insertQuery, [username, password], (err, result) => {
            if (err) {
                console.error('❌ Insert Error:', err);
                return res.status(500).json({ error: 'Failed to register user' });
            }
            res.json({ success: true, message: 'Registration successful' });
        });
    });
});

module.exports = router;
