
const express = require('express');
const db = require('./db');  // Import the MySQL connection
const router = express.Router();

// Handle login requests
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Use prepared statements for added security and efficiency
  const query = 'SELECT * FROM users WHERE username = ?';
  
  try {
    const [result] = await db.promise().query(query, [username]);

    if (result.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = result[0]; // Assuming username is unique
    
    // Direct password comparison (again, not recommended for production)
    if (user.password === password) {
      // Store username in session
      req.session.username = user.username;
      return res.status(200).json({ message: 'Login successful', user });
    } else {
      return res.status(400).json({ error: 'Incorrect password' });
    }
  } catch (err) {
    console.error('Database query error:', err);
    return res.status(500).json({ error: 'Database query error' });
  }
});

module.exports = router;
