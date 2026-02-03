const pool = require("../config/db");

async function getPrinterSettings(branchId = null) {
    let query = "SELECT * FROM printer_settings";
    let params = [];

    if (branchId) {
        query += " WHERE branch_id = ?";
        params.push(branchId);
    }

    query += " LIMIT 1";

    const [rows] = await pool.query(query, params);
    return rows[0] || null;
}

async function updatePrinterSettings(data, branchId = null) {
    const existing = await getPrinterSettings(branchId);

    if (existing) {
        // Update existing settings
        const [result] = await pool.query(
            `UPDATE printer_settings 
            SET invoice_printer = ?,
                invoice_paper_type = ?,
                report_printer = ?,
                report_paper_type = ?
            WHERE id = ?`,
            [
                data.invoice_printer,
                data.invoice_paper_type,
                data.report_printer,
                data.report_paper_type,
                existing.id
            ]
        );
        return result.affectedRows;
    } else {
        // Insert new settings
        const [result] = await pool.query(
            `INSERT INTO printer_settings 
            (invoice_printer, invoice_paper_type, report_printer, report_paper_type, branch_id) 
            VALUES (?, ?, ?, ?, ?)`,
            [
                data.invoice_printer,
                data.invoice_paper_type,
                data.report_printer,
                data.report_paper_type,
                branchId
            ]
        );
        return result.insertId;
    }
}

module.exports = {
    getPrinterSettings,
    updatePrinterSettings
};
