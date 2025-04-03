const express = require('express');
const db = require('./db');
const router = express.Router();

// ✅ FIXED: Change route from `/` to `/submitIdea`
router.post('/submitIdea', async (req, res) => {
    const { username, title, description, video, category, location } = req.body;

    // ✅ FIXED: Ensure session exists
    if (!req.session || !req.session.username) {
        return res.status(401).json({ error: 'User not logged in' });
    }
    if (req.session.username !== username) {
        return res.status(403).json({ error: 'Username mismatch. Please use your logged-in account.' });
    }

    try {
        // ✅ FIXED: Validate if the username exists in users table
        const [user] = await db.promise().query('SELECT username FROM users WHERE username = ?', [username]);

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // ✅ FIXED: Ensure correct column names in the query (video, not vedio)
        const query = 'INSERT INTO ideas (username, title, idea, vedio, category, location) VALUES (?, ?, ?, ?, ?, ?)';
        await db.promise().query(query, [username, title, description, video, category, location]);

        res.json({ message: 'Idea submitted successfully' });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
