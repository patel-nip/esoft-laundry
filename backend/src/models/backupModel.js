const pool = require("../config/db");

async function getBackupConfig() {
    const [rows] = await pool.query("SELECT * FROM backup_config LIMIT 1");
    return rows[0] || null;
}

async function updateBackupConfig(data) {
    const existing = await getBackupConfig();

    if (existing) {
        const [result] = await pool.query(
            `UPDATE backup_config 
            SET backup_location = ?,
                backup_cycle_days = ?,
                auto_backup_enabled = ?
            WHERE id = ?`,
            [
                data.backup_location,
                data.backup_cycle_days,
                data.auto_backup_enabled,
                existing.id
            ]
        );
        return result.affectedRows;
    } else {
        const [result] = await pool.query(
            `INSERT INTO backup_config 
            (backup_location, backup_cycle_days, auto_backup_enabled) 
            VALUES (?, ?, ?)`,
            [
                data.backup_location,
                data.backup_cycle_days,
                data.auto_backup_enabled
            ]
        );
        return result.insertId;
    }
}

async function updateBackupDates(lastBackupDate, nextBackupDate) {
    const existing = await getBackupConfig();
    if (!existing) return 0;

    const [result] = await pool.query(
        `UPDATE backup_config 
        SET last_backup_date = ?,
            next_backup_date = ?
        WHERE id = ?`,
        [lastBackupDate, nextBackupDate, existing.id]
    );
    return result.affectedRows;
}

module.exports = {
    getBackupConfig,
    updateBackupConfig,
    updateBackupDates
};
