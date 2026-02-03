const pool = require("../config/db");

// ✅ Get invoice settings (branch-specific)
async function getInvoiceSettings(branchId = null) {
    let query = "SELECT * FROM invoice_settings";
    let params = [];

    if (branchId) {
        query += " WHERE branch_id = ?";
        params.push(branchId);
    }

    query += " LIMIT 1";

    const [rows] = await pool.query(query, params);
    return rows[0] || null;
}

// ✅ Update invoice settings (branch-specific)
async function updateInvoiceSettings(data, branchId) {
    const existing = await getInvoiceSettings(branchId);

    if (existing) {
        // Update existing settings
        let query = `UPDATE invoice_settings 
            SET footer_message = ?, 
                terms_and_conditions = ?
            WHERE id = ?`;

        let params = [data.footer_message, data.terms_and_conditions, existing.id];

        if (branchId) {
            query += " AND branch_id = ?";
            params.push(branchId);
        }

        const [result] = await pool.query(query, params);
        return result.affectedRows;
    } else {
        // Create new settings
        const [result] = await pool.query(
            `INSERT INTO invoice_settings (footer_message, terms_and_conditions, branch_id) 
            VALUES (?, ?, ?)`,
            [data.footer_message, data.terms_and_conditions, branchId]
        );
        return result.insertId;
    }
}

// ✅ Get all invoice settings (Super Admin - see all branches)
async function getAllInvoiceSettings() {
    const [rows] = await pool.query(`
        SELECT ins.*, b.name as branch_name, b.branch_code
        FROM invoice_settings ins
        LEFT JOIN branches b ON ins.branch_id = b.id
        ORDER BY b.name
    `);
    return rows;
}

module.exports = {
    getInvoiceSettings,
    updateInvoiceSettings,
    getAllInvoiceSettings
};
