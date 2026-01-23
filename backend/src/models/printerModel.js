const pool = require("../config/db");

async function getPrinterSettings() {
    const [rows] = await pool.query("SELECT * FROM printer_settings LIMIT 1");
    return rows[0] || null;
}

async function updatePrinterSettings(data) {
    const existing = await getPrinterSettings();

    if (existing) {
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
        const [result] = await pool.query(
            `INSERT INTO printer_settings 
            (invoice_printer, invoice_paper_type, report_printer, report_paper_type) 
            VALUES (?, ?, ?, ?)`,
            [
                data.invoice_printer,
                data.invoice_paper_type,
                data.report_printer,
                data.report_paper_type
            ]
        );
        return result.insertId;
    }
}

module.exports = {
    getPrinterSettings,
    updatePrinterSettings
};
