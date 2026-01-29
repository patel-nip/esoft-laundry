const pool = require("../config/db");

async function generateOrderCode() {
    const year = new Date().getFullYear();
    const prefix = `ORD${year}`;

    const [rows] = await pool.query(
        `SELECT code FROM orders 
         WHERE code LIKE ? 
         ORDER BY code DESC 
         LIMIT 1`,
        [`${prefix}%`]
    );

    let nextNumber = 1;

    if (rows.length > 0) {
        const lastCode = rows[0].code;
        const lastNumber = parseInt(lastCode.slice(-5));
        nextNumber = lastNumber + 1;
    }

    return `${prefix}${String(nextNumber).padStart(5, '0')}`;
}

async function getAllOrders(status = null) {
    let query = `
    SELECT o.*, c.name as customer_name, c.phone as customer_phone, c.phone2 as customer_phone2
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
  `;

    const params = [];

    if (status) {
        query += " WHERE o.status = ?";
        params.push(status);
    }

    query += " ORDER BY o.created_at DESC";

    const [rows] = await pool.query(query, params);
    return rows;
}

async function findOrderById(id) {
    const [rows] = await pool.query(
        `SELECT o.*, c.name as customer_name, c.phone as customer_phone, c.phone2 as customer_phone2, c.rnc as customer_rnc
     FROM orders o
     JOIN customers c ON o.customer_id = c.id
     WHERE o.id = ?`,
        [id]
    );
    return rows[0] || null;
}

async function findOrderByCode(code) {
    const [rows] = await pool.query(
        `SELECT o.*, c.name as customer_name, c.phone as customer_phone, c.phone2 as customer_phone2
     FROM orders o
     JOIN customers c ON o.customer_id = c.id
     WHERE o.code = ?`,
        [code]
    );
    return rows[0] || null;
}

async function createOrder(data) {
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
     user_created, subtotal, tax, discount, total, paid, balance, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [code, customer_id, status || 'RECEIVED', order_date, order_time, eta_date, eta_time,
            user_created, subtotal, tax, discount, total, paid, balance, notes || null]
    );

    return result.insertId;
}

async function updateOrder(id, data) {
    const fields = [];
    const values = [];

    Object.keys(data).forEach(key => {
        fields.push(`${key} = ?`);
        values.push(data[key]);
    });

    values.push(id);

    await pool.query(
        `UPDATE orders SET ${fields.join(", ")} WHERE id = ?`,
        values
    );

    return findOrderById(id);
}

async function deleteOrder(id) {
    await pool.query("DELETE FROM orders WHERE id = ?", [id]);
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
