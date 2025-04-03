
const express = require('express');
const router = express.Router();
const db = require('./db'); // Import MySQL2 connection
const bcrypt = require('bcryptjs');

// Fetch user profile
router.get('/user', async (req, res) => {
    try {
        const username = req.session.username;
        if (!username) {
            return res.status(403).json({ success: false, message: "User not logged in" });
        }

        const [results] = await db.promise().query('SELECT username FROM users WHERE username = ?', [username]);

        if (results.length > 0) {
            res.json({ success: true, username: results[0].username });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Change password
router.post('/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const username = req.session.username;

        if (!username) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        // Fetch user password from DB
        const [results] = await db.promise().query('SELECT password FROM users WHERE username = ?', [username]);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let storedHashedPassword = results[0].password;
        console.log(`Stored Hashed Password: ${storedHashedPassword}`);
        console.log(`Entered Password: ${currentPassword}`);

        // Compare entered password with stored hashed password
        const isMatch = await bcrypt.compare(currentPassword, storedHashedPassword);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect current password" });
        }

        // Hash the new password before storing
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the database with the new hashed password
        await db.promise().query('UPDATE users SET password = ? WHERE username = ?', [hashedNewPassword, username]);

        res.json({ success: true, message: "Password updated successfully" });

    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;






