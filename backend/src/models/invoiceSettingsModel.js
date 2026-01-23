const pool = require("../config/db");

async function getInvoiceSettings() {
    const [rows] = await pool.query("SELECT * FROM invoice_settings LIMIT 1");
    return rows[0] || null;
}

async function updateInvoiceSettings(data) {
    const existing = await getInvoiceSettings();

    if (existing) {
        const [result] = await pool.query(
            `UPDATE invoice_settings 
            SET footer_message = ?, 
                terms_and_conditions = ?
            WHERE id = ?`,
            [data.footer_message, data.terms_and_conditions, existing.id]
        );
        return result.affectedRows;
    } else {
        const [result] = await pool.query(
            `INSERT INTO invoice_settings (footer_message, terms_and_conditions) 
            VALUES (?, ?)`,
            [data.footer_message, data.terms_and_conditions]
        );
        return result.insertId;
    }
}

module.exports = {
    getInvoiceSettings,
    updateInvoiceSettings
};
