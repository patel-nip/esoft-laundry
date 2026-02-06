const db = require('../config/db');

const branchModel = {
    // Get all branches
    getAll: async () => {
        const query = `
            SELECT 
                id,
                branch_code,
                branch_name AS name,
                owner_name,
                location,
                city,
                state,
                country,
                phone,
                email,
                status,
                subscription_plan,
                subscription_expires,
                created_at,
                updated_at
            FROM branches 
            ORDER BY created_at DESC
        `;
        const [results] = await db.query(query);
        return results;
    },

    // Get branch by ID
    getById: async (branchId) => {
        const query = `
            SELECT 
                id,
                branch_code,
                branch_name AS name,
                owner_name,
                location,
                city,
                state,
                country,
                phone,
                email,
                status,
                subscription_plan,
                subscription_expires,
                created_at,
                updated_at
            FROM branches 
            WHERE id = ?
        `;
        const [results] = await db.query(query, [branchId]);
        return results[0];
    },

    // Get branch by code
    getByCode: async (branchCode) => {
        const query = `
            SELECT 
                id,
                branch_code,
                branch_name AS name,
                owner_name,
                location,
                city,
                state,
                country,
                phone,
                email,
                status,
                subscription_plan,
                subscription_expires,
                created_at,
                updated_at
            FROM branches 
            WHERE branch_code = ?
        `;
        const [results] = await db.query(query, [branchCode]);
        return results[0];
    },

    // Create new branch
    create: async (branchData) => {
        const query = `
            INSERT INTO branches (branch_name, branch_code, location, phone, email, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            branchData.name,  // Frontend sends 'name', we map to 'branch_name'
            branchData.branch_code,
            branchData.location,
            branchData.contact_phone || null,
            branchData.contact_email || null,
            branchData.status || 'ACTIVE'
        ];

        const [result] = await db.query(query, values);
        return { id: result.insertId, name: branchData.name, ...branchData };
    },

    // Update branch
    update: async (branchId, branchData) => {
        const query = `
            UPDATE branches 
            SET branch_name = ?, location = ?, phone = ?, 
                email = ?, status = ?
            WHERE id = ?
        `;
        const values = [
            branchData.name,  // Frontend sends 'name', we map to 'branch_name'
            branchData.location,
            branchData.contact_phone || null,
            branchData.contact_email || null,
            branchData.status || 'ACTIVE',
            branchId
        ];

        const [result] = await db.query(query, values);
        return result;
    },

    // Delete branch (soft delete - change status to inactive)
    delete: async (branchId) => {
        const query = 'UPDATE branches SET status = ? WHERE id = ?';
        const [result] = await db.query(query, ['INACTIVE', branchId]);
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
