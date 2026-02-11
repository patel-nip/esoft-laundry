const pool = require("../config/db");

async function getItemsByOrderId(orderId) {
    const [rows] = await pool.query(
        "SELECT * FROM order_items WHERE order_id = ? ORDER BY id",
        [orderId]
    );
    return rows;
}

async function createOrderItem(data) {
    const { branch_id, order_id, qty, garment_name, color, service, is_express, price, note } = data;

    const [result] = await pool.query(
        `INSERT INTO order_items (branch_id, order_id, qty, garment_name, color, service, is_express, price, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [branch_id, order_id, qty, garment_name, color || null, service || null, is_express || 'NO', price || 0, note || null]
    );

    return result.insertId;
}

async function deleteItemsByOrderId(orderId) {
    await pool.query("DELETE FROM order_items WHERE order_id = ?", [orderId]);
}

module.exports = {
    getItemsByOrderId,
    createOrderItem,
    deleteItemsByOrderId,
};
