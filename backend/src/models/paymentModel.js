const pool = require("../config/db");

async function getPaymentsByOrderId(orderId) {
    const [rows] = await pool.query(
        "SELECT * FROM payments WHERE order_id = ? ORDER BY payment_date DESC",
        [orderId]
    );
    return rows;
}

async function createPayment(data) {
    const { order_id, amount, payment_method } = data;

    const [result] = await pool.query(
        "INSERT INTO payments (order_id, amount, payment_method) VALUES (?, ?, ?)",
        [order_id, amount, payment_method]
    );

    return result.insertId;
}

module.exports = {
    getPaymentsByOrderId,
    createPayment,
};
