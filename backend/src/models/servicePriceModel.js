const pool = require("../config/db");

// ✅ Get all service prices (filtered by branch)
async function getAllServicePrices(branchId = null) {
    let query = `
        SELECT 
            id,
            garment_name,
            category,
            image_url,
            wash_iron,
            wash_iron_white,
            iron_only,
            alterations,
            express_percentage,
            branch_id
        FROM service_prices
    `;
    let params = [];

    if (branchId) {
        query += " WHERE branch_id = ?";
        params.push(branchId);
    }

    query += " ORDER BY garment_name ASC";

    const [rows] = await pool.query(query, params);
    return rows;
}

// ✅ Get service price by ID (with branch check)
async function getServicePriceById(id, branchId = null) {
    let query = "SELECT * FROM service_prices WHERE id = ?";
    let params = [id];

    if (branchId) {
        query += " AND branch_id = ?";
        params.push(branchId);
    }

    const [rows] = await pool.query(query, params);
    return rows[0] || null;
}

// ✅ Get service price by garment name (with branch check)
async function getServicePriceByGarment(garmentName, branchId = null) {
    let query = "SELECT * FROM service_prices WHERE garment_name = ?";
    let params = [garmentName];

    if (branchId) {
        query += " AND branch_id = ?";
        params.push(branchId);
    }

    const [rows] = await pool.query(query, params);
    return rows[0] || null;
}

// ✅ Create service price (with branch_id)
async function createServicePrice(data, branchId) {
    const [result] = await pool.query(
        `INSERT INTO service_prices 
        (garment_name, category, image_url, wash_iron, wash_iron_white, iron_only, alterations, express_percentage, branch_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.garment_name,
            data.category || "Other",
            data.image_url || null,
            data.wash_iron || 0,
            data.wash_iron_white || 0,
            data.iron_only || 0,
            data.alterations || 0,
            data.express_percentage || 20,
            branchId
        ]
    );
    return result.insertId;
}

// ✅ Update service price (with branch check)
async function updateServicePrice(id, data, branchId = null) {
    let query = `UPDATE service_prices 
        SET garment_name = ?,
            category = ?,
            image_url = ?,
            wash_iron = ?, 
            wash_iron_white = ?, 
            iron_only = ?, 
            alterations = ?, 
            express_percentage = ? 
        WHERE id = ?`;

    let params = [
        data.garment_name,
        data.category || "Other",
        data.image_url || null,
        data.wash_iron,
        data.wash_iron_white,
        data.iron_only,
        data.alterations,
        data.express_percentage,
        id
    ];

    if (branchId) {
        query += " AND branch_id = ?";
        params.push(branchId);
    }

    const [result] = await pool.query(query, params);
    return result.affectedRows;
}

// ✅ Delete service price (with branch check)
async function deleteServicePrice(id, branchId = null) {
    let query = "DELETE FROM service_prices WHERE id = ?";
    let params = [id];

    if (branchId) {
        query += " AND branch_id = ?";
        params.push(branchId);
    }

    const [result] = await pool.query(query, params);
    return result.affectedRows;
}

module.exports = {
    getAllServicePrices,
    getServicePriceById,
    getServicePriceByGarment,
    createServicePrice,
    updateServicePrice,
    deleteServicePrice
};
