const mysql = require('mysql2');

// Set up your database connection
const db = mysql.createConnection({
    host: 'localhost', // Replace with your DB host
    user: 'b_sandeepkumar', // Replace with your DB username
    password: 'Bsk@2004', // Replace with your DB password
    database: 'project' // Replace with your DB name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit if there's an error
    }
    console.log('Connected to the database');
});

module.exports = db;
