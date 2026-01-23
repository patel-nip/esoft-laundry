const pool = require("../config/db");
const bcrypt = require("bcrypt");

async function findUserByUsername(username) {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    return rows[0] || null;
}

async function getAllUsers() {
    const [rows] = await pool.query(`
        SELECT 
            id, 
            username, 
            name, 
            email, 
            phone, 
            role, 
            branch, 
            status,
            created_at
        FROM users 
        ORDER BY created_at DESC
    `);
    return rows;
}

async function getUserById(id) {
    const [rows] = await pool.query(`
        SELECT 
            id, 
            username, 
            name, 
            email, 
            phone, 
            role, 
            branch, 
            status,
            created_at
        FROM users 
        WHERE id = ?
    `, [id]);
    return rows[0] || null;
}

async function createUser(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const [result] = await pool.query(
        `INSERT INTO users 
        (username, password_hash, name, email, phone, role, branch, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.username,
            hashedPassword,
            data.name || null,
            data.email || null,
            data.phone || null,
            data.role || 'ADMIN',
            data.branch || 'MAIN',
            data.status || 'ACTIVE'
        ]
    );
    return result.insertId;
}

async function updateUser(id, data) {
    let query = `UPDATE users SET username = ?, name = ?, email = ?, phone = ?, role = ?, branch = ?, status = ?`;
    let params = [
        data.username,
        data.name,
        data.email,
        data.phone,
        data.role,
        data.branch,
        data.status
    ];
    
    if (data.password) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        query += `, password_hash = ?`;
        params.push(hashedPassword);
    }
    
    query += ` WHERE id = ?`;
    params.push(id);
    
    const [result] = await pool.query(query, params);
    return result.affectedRows;
}

async function deleteUser(id) {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows;
}

module.exports = {
    findUserByUsername,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
