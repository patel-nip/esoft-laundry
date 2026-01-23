const pool = require("../config/db");

async function getAllCustomers() {
    const [rows] = await pool.query("SELECT * FROM customers ORDER BY created_at DESC");
    return rows;
}

async function findCustomerById(id) {
    const [rows] = await pool.query("SELECT * FROM customers WHERE id = ?", [id]);
    return rows[0] || null;
}

async function findCustomerByCode(code) {
    const [rows] = await pool.query("SELECT * FROM customers WHERE code = ?", [code]);
    return rows[0] || null;
}

async function searchCustomers(searchTerm) {
    const term = `%${searchTerm}%`;
    const [rows] = await pool.query(
        "SELECT * FROM customers WHERE name LIKE ? OR phone LIKE ? OR code LIKE ? ORDER BY name",
        [term, term, term]
    );
    return rows;
}

async function createCustomer(data) {
    const { code, name, phone, phone2, address, rnc } = data;

    const [result] = await pool.query(
        "INSERT INTO customers (code, name, phone, phone2, address, rnc) VALUES (?, ?, ?, ?, ?, ?)",
        [code, name, phone, phone2 || null, address || null, rnc || null]
    );

    const [rows] = await pool.query("SELECT * FROM customers WHERE id = ?", [result.insertId]);
    return rows[0];
}

async function updateCustomer(id, data) {
    const { name, phone, phone2, address, rnc } = data;

    await pool.query(
        "UPDATE customers SET name = ?, phone = ?, phone2 = ?, address = ?, rnc = ? WHERE id = ?",
        [name, phone, phone2 || null, address || null, rnc || null, id]
    );

    const [rows] = await pool.query("SELECT * FROM customers WHERE id = ?", [id]);
    return rows[0];
}

async function deleteCustomer(id) {
    await pool.query("DELETE FROM customers WHERE id = ?", [id]);
}

module.exports = {
    getAllCustomers,
    findCustomerById,
    findCustomerByCode,
    searchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
};
