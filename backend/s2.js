const express = require('express');
const db = require('./db');
const router = express.Router();

// Retrieve all ideas
router.get('/getIdeas', async (req, res) => {
    try {
        // Fetch only necessary columns to optimize performance
        const query = "SELECT username, title, idea, vedio, category, location FROM ideas";
        const [ideas] = await db.promise().query(query);

        if (ideas.length === 0) {
            return res.status(404).json({ message: 'No ideas found' });
        }

        res.json(ideas);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
