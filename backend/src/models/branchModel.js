const db = require('../config/db');

const branchModel = {
    // Get all branches
    getAll: async () => {
        const query = 'SELECT * FROM branches ORDER BY created_at DESC';
        const [results] = await db.query(query);
        return results;
    },

    // Get branch by ID
    getById: async (branchId) => {
        const query = 'SELECT * FROM branches WHERE id = ?';
        const [results] = await db.query(query, [branchId]);
        return results[0];
    },

    // Get branch by code
    getByCode: async (branchCode) => {
        const query = 'SELECT * FROM branches WHERE branch_code = ?';
        const [results] = await db.query(query, [branchCode]);
        return results[0];
    },

    // Create new branch
    create: async (branchData) => {
        const query = `
            INSERT INTO branches (name, branch_code, location, contact_phone, contact_email, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            branchData.name,
            branchData.branch_code,
            branchData.location,
            branchData.contact_phone || null,
            branchData.contact_email || null,
            branchData.status || 'active'
        ];

        const [result] = await db.query(query, values);
        return { id: result.insertId, ...branchData };
    },

    // Update branch
    update: async (branchId, branchData) => {
        const query = `
            UPDATE branches 
            SET name = ?, location = ?, contact_phone = ?, 
                contact_email = ?, status = ?
            WHERE id = ?
        `;
        const values = [
            branchData.name,
            branchData.location,
            branchData.contact_phone || null,
            branchData.contact_email || null,
            branchData.status || 'active',
            branchId
        ];

        const [result] = await db.query(query, values);
        return result;
    },

    // Delete branch (soft delete - change status to inactive)
    delete: async (branchId) => {
        const query = 'UPDATE branches SET status = ? WHERE id = ?';
        const [result] = await db.query(query, ['inactive', branchId]);
        return result;
    },

    // Get branch statistics
    getStats: async (branchId) => {
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM customers WHERE branch_id = ?) as total_customers,
                (SELECT COUNT(*) FROM orders WHERE branch_id = ?) as total_orders,
                (SELECT COUNT(*) FROM orders WHERE branch_id = ? AND status = 'RECEIVED') as pending_orders,
                (SELECT COUNT(*) FROM users WHERE branch_id = ?) as total_users
        `;
        const [results] = await db.query(query, [branchId, branchId, branchId, branchId]);
        return results[0];
    }
};

module.exports = branchModel;
