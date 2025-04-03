const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost', // Replace with your DB host
    user: 'b_sandeepkumar', // Replace with your DB username
    password: 'Bsk@2004', // Replace with your DB password
    database: 'project',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db1;
