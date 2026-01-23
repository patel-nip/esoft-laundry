const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000,        // ← Add: 60 seconds timeout
    acquireTimeout: 60000,         // ← Add: 60 seconds to acquire connection
    timeout: 60000,                // ← Add: 60 seconds query timeout
    enableKeepAlive: true,         // ← Add: Keep connection alive
    keepAliveInitialDelay: 0       // ← Add: Start keep-alive immediately
});

console.log('Database config:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

module.exports = pool;
