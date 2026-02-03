const pool = require("../config/db");

// ✅ Generate order code (branch-specific)
async function generateOrderCode(branchId = null) {
    const year = new Date().getFullYear();
    const prefix = `ORD${year}`;

    let query = `SELECT code FROM orders WHERE code LIKE ?`;
    let params = [`${prefix}%`];

    if (branchId) {
        query += " AND branch_id = ?";
        params.push(branchId);
    }

    query += " ORDER BY code DESC LIMIT 1";

    const [rows] = await pool.query(query, params);

    let nextNumber = 1;

    if (rows.length > 0) {
        const lastCode = rows[0].code;
        const lastNumber = parseInt(lastCode.slice(-5));
        nextNumber = lastNumber + 1;
    }

    return `${prefix}${String(nextNumber).padStart(5, '0')}`;
}

// ✅ Get all orders (filtered by branch)
async function getAllOrders(status = null, branchId = null) {
    let query = `
        SELECT o.*, 
               c.name as customer_name, 
               c.phone as customer_phone, 
               c.phone2 as customer_phone2
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        WHERE 1=1
    `;

    const params = [];

    if (branchId) {
        query += " AND o.branch_id = ?";
        params.push(branchId);
    }

    if (status) {
        query += " AND o.status = ?";
        params.push(status);
    }

    query += " ORDER BY o.created_at DESC";

    try {
        const [rows] = await pool.query(query, params);
        return rows;
    } catch (error) {
        console.error("Error in getAllOrders:", error);
        throw error;
    }
}

// ✅ Find order by ID (with branch check)
async function findOrderById(id, branchId = null) {
    let query = `
        SELECT o.*, 
               c.name as customer_name, 
               c.phone as customer_phone, 
               c.phone2 as customer_phone2, 
               c.rnc as customer_rnc
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        WHERE o.id = ?
    `;
    let params = [id];

    if (branchId) {
        query += " AND o.branch_id = ?";
        params.push(branchId);
    }

    const [rows] = await pool.query(query, params);
    return rows[0] || null;
}

// ✅ Find order by code (with branch check)
async function findOrderByCode(code, branchId = null) {
    let query = `
        SELECT o.*, 
               c.name as customer_name, 
               c.phone as customer_phone, 
               c.phone2 as customer_phone2
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        WHERE o.code = ?
    `;
    let params = [code];

    if (branchId) {
        query += " AND o.branch_id = ?";
        params.push(branchId);
    }

    const [rows] = await pool.query(query, params);
    return rows[0] || null;
}

// ✅ Create order (with branch_id)
async function createOrder(data, branchId) {
    const {
        code,
        customer_id,
        status,
        order_date,
        order_time,
        eta_date,
        eta_time,
        user_created,
        subtotal,
        tax,
        discount,
        total,
        paid,
        balance,
        notes
    } = data;

    const [result] = await pool.query(
        `INSERT INTO orders (code, customer_id, status, order_date, order_time, eta_date, eta_time, 
         user_created, subtotal, tax, discount, total, paid, balance, notes, branch_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [code, customer_id, status || 'RECEIVED', order_date, order_time, eta_date, eta_time,
            user_created, subtotal, tax, discount, total, paid, balance, notes || null, branchId]
    );

    return result.insertId;
}

// ✅ Update order (with branch check)
async function updateOrder(id, data, branchId = null) {
    const fields = [];
    const values = [];

    Object.keys(data).forEach(key => {
        fields.push(`${key} = ?`);
        values.push(data[key]);
    });

    values.push(id);

    let query = `UPDATE orders SET ${fields.join(", ")} WHERE id = ?`;

    if (branchId) {
        query += " AND branch_id = ?";
        values.push(branchId);
    }

    await pool.query(query, values);

    return findOrderById(id, branchId);
}

// ✅ Delete order (with branch check)
async function deleteOrder(id, branchId = null) {
    let query = "DELETE FROM orders WHERE id = ?";
    let params = [id];

    if (branchId) {
        query += " AND branch_id = ?";
        params.push(branchId);
    }

    await pool.query(query, params);
}

module.exports = {
    generateOrderCode,
    getAllOrders,
    findOrderById,
    findOrderByCode,
    createOrder,
    updateOrder,
    deleteOrder,
};
