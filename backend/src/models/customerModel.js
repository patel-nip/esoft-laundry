const pool = require("../config/db");

// ✅ Get all customers (filtered by branch)
async function getAllCustomers(branchId = null) {
    let query = "SELECT * FROM customers";
    let params = [];

    if (branchId) {
        query += " WHERE branch_id = ?";
        params.push(branchId);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await pool.query(query, params);
    return rows;
}

// ✅ Find customer by ID (with branch check)
async function findCustomerById(id, branchId = null) {
    let query = "SELECT * FROM customers WHERE id = ?";
    let params = [id];

    if (branchId) {
        query += " AND branch_id = ?";
        params.push(branchId);
    }

    const [rows] = await pool.query(query, params);
    return rows[0] || null;
}

// ✅ Find customer by code (with branch check)
async function findCustomerByCode(code, branchId = null) {
    let query = "SELECT * FROM customers WHERE code = ?";
    let params = [code];

    if (branchId) {
        query += " AND branch_id = ?";
        params.push(branchId);
    }

    const [rows] = await pool.query(query, params);
    return rows[0] || null;
}

// ✅ Search customers (filtered by branch)
async function searchCustomers(searchTerm, branchId = null) {
    const term = `%${searchTerm}%`;
    let query = "SELECT * FROM customers WHERE (name LIKE ? OR phone LIKE ? OR code LIKE ?)";
    let params = [term, term, term];

    if (branchId) {
        query += " AND branch_id = ?";
        params.push(branchId);
    }

    query += " ORDER BY name";

    const [rows] = await pool.query(query, params);
    return rows;
}

// ✅ Create customer (with branch_id)
async function createCustomer(data, branchId) {
    const { code, name, phone, phone2, address, rnc } = data;

    const [result] = await pool.query(
        "INSERT INTO customers (code, name, phone, phone2, address, rnc, branch_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [code, name, phone, phone2 || null, address || null, rnc || null, branchId]
    );

    const [rows] = await pool.query("SELECT * FROM customers WHERE id = ?", [result.insertId]);
    return rows[0];
}

// ✅ Update customer (with branch check)
async function updateCustomer(id, data, branchId = null) {
    const { name, phone, phone2, address, rnc } = data;

    let query = "UPDATE customers SET name = ?, phone = ?, phone2 = ?, address = ?, rnc = ? WHERE id = ?";
    let params = [name, phone, phone2 || null, address || null, rnc || null, id];

    if (branchId) {
        query += " AND branch_id = ?";
        params.push(branchId);
    }

    await pool.query(query, params);

    const [rows] = await pool.query("SELECT * FROM customers WHERE id = ?", [id]);
    return rows[0];
}

// ✅ Delete customer (with branch check)
async function deleteCustomer(id, branchId = null) {
    let query = "DELETE FROM customers WHERE id = ?";
    let params = [id];

    if (branchId) {
        query += " AND branch_id = ?";
        params.push(branchId);
    }

    await pool.query(query, params);
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
