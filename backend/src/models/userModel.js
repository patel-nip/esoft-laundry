const pool = require("../config/db");
const bcrypt = require("bcrypt");

async function findUserByUsername(username) {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    return rows[0] || null;
}

// ✅ Get all users (filtered by branch)
async function getAllUsers(branchId = null) {
    let query = `
        SELECT 
            id, 
            username, 
            name, 
            email, 
            phone, 
            role, 
            branch_id,
            status,
            created_at
        FROM users
    `;
    let params = [];

    if (branchId) {
        query += " WHERE branch_id = ?";
        params.push(branchId);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await pool.query(query, params);
    return rows;
}

// ✅ Get user by ID (with branch check)
async function getUserById(id, branchId = null) {
    let query = `
        SELECT 
            id, 
            username, 
            name, 
            email, 
            phone, 
            role, 
            branch_id,
            status,
            created_at
        FROM users 
        WHERE id = ?
    `;
    let params = [id];

    if (branchId) {
        query += " AND branch_id = ?";
        params.push(branchId);
    }

    const [rows] = await pool.query(query, params);
    return rows[0] || null;
}

// ✅ Create user (with branch_id)
async function createUser(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const [result] = await pool.query(
        `INSERT INTO users 
        (username, password_hash, name, email, phone, role, branch_id, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.username,
            hashedPassword,
            data.name || null,
            data.email || null,
            data.phone || null,
            data.role || 'CASHIER',
            data.branch_id || null, // ✅ Changed from 'branch' to 'branch_id'
            data.status || 'ACTIVE'
        ]
    );
    return result.insertId;
}

// ✅ Update user (with branch check)
async function updateUser(id, data, branchId = null) {
    let query = `UPDATE users SET username = ?, name = ?, email = ?, phone = ?, role = ?, status = ?`;
    let params = [
        data.username,
        data.name,
        data.email,
        data.phone,
        data.role,
        data.status
    ];
    
    // ✅ Update branch_id if provided
    if (data.branch_id !== undefined) {
        query += `, branch_id = ?`;
        params.push(data.branch_id);
    }
    
    if (data.password) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        query += `, password_hash = ?`;
        params.push(hashedPassword);
    }
    
    query += ` WHERE id = ?`;
    params.push(id);

    // ✅ Add branch check for non-super admins
    if (branchId) {
        query += " AND branch_id = ?";
        params.push(branchId);
    }
    
    const [result] = await pool.query(query, params);
    return result.affectedRows;
}

// ✅ Delete user (with branch check)
async function deleteUser(id, branchId = null) {
    let query = "DELETE FROM users WHERE id = ?";
    let params = [id];

    if (branchId) {
        query += " AND branch_id = ?";
        params.push(branchId);
    }

    const [result] = await pool.query(query, params);
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
