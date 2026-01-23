const pool = require("../config/db");

async function getAllServicePrices() {
    const [rows] = await pool.query(`
        SELECT 
            id,
            garment_name,
            wash_iron,
            wash_iron_white,
            iron_only,
            alterations,
            express_percentage
        FROM service_prices 
        ORDER BY garment_name ASC
    `);
    return rows;
}

async function getServicePriceById(id) {
    const [rows] = await pool.query(
        "SELECT * FROM service_prices WHERE id = ?",
        [id]
    );
    return rows[0] || null;
}

async function getServicePriceByGarment(garmentName) {
    const [rows] = await pool.query(
        "SELECT * FROM service_prices WHERE garment_name = ?",
        [garmentName]
    );
    return rows[0] || null;
}

async function createServicePrice(data) {
    const [result] = await pool.query(
        `INSERT INTO service_prices 
        (garment_name, wash_iron, wash_iron_white, iron_only, alterations, express_percentage) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            data.garment_name,
            data.wash_iron || 0,
            data.wash_iron_white || 0,
            data.iron_only || 0,
            data.alterations || 0,
            data.express_percentage || 20
        ]
    );
    return result.insertId;
}

async function updateServicePrice(id, data) {
    const [result] = await pool.query(
        `UPDATE service_prices 
        SET garment_name = ?, 
            wash_iron = ?, 
            wash_iron_white = ?, 
            iron_only = ?, 
            alterations = ?, 
            express_percentage = ? 
        WHERE id = ?`,
        [
            data.garment_name,
            data.wash_iron,
            data.wash_iron_white,
            data.iron_only,
            data.alterations,
            data.express_percentage,
            id
        ]
    );
    return result.affectedRows;
}

async function deleteServicePrice(id) {
    const [result] = await pool.query(
        "DELETE FROM service_prices WHERE id = ?",
        [id]
    );
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
