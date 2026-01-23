const pool = require("../config/db");

async function getAllNCFRanges() {
    const [rows] = await pool.query(`
        SELECT 
            id,
            series_type,
            prefix,
            initial_number,
            last_number,
            current_number,
            is_active,
            created_at
        FROM ncf_ranges 
        ORDER BY series_type
    `);
    return rows;
}

async function getNCFRangeById(id) {
    const [rows] = await pool.query(
        "SELECT * FROM ncf_ranges WHERE id = ?",
        [id]
    );
    return rows[0] || null;
}

async function getNCFRangeByType(seriesType) {
    const [rows] = await pool.query(
        "SELECT * FROM ncf_ranges WHERE series_type = ? AND is_active = 'YES'",
        [seriesType]
    );
    return rows[0] || null;
}

async function createNCFRange(data) {
    const [result] = await pool.query(
        `INSERT INTO ncf_ranges 
        (series_type, prefix, initial_number, last_number, current_number, is_active) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            data.series_type,
            data.prefix,
            data.start_number,
            data.end_number,
            data.current_number || data.start_number,
            data.status || 'YES'
        ]
    );
    return result.insertId;
}

async function updateNCFRange(id, data) {
    const [result] = await pool.query(
        `UPDATE ncf_ranges 
        SET series_type = ?,
            prefix = ?,
            initial_number = ?,
            last_number = ?,
            current_number = ?,
            is_active = ?
        WHERE id = ?`,
        [
            data.series_type,
            data.prefix,
            data.start_number,
            data.end_number,
            data.current_number,
            data.status,
            id
        ]
    );
    return result.affectedRows;
}

async function updateCurrentNumber(id, newNumber) {
    const [result] = await pool.query(
        "UPDATE ncf_ranges SET current_number = ? WHERE id = ?",
        [newNumber, id]
    );
    return result.affectedRows;
}

async function getNextNCF(seriesType) {
    const range = await getNCFRangeByType(seriesType);

    if (!range) {
        throw new Error(`No active NCF range found for type ${seriesType}`);
    }

    if (range.current_number > range.last_number) {
        throw new Error(`NCF range ${seriesType} exhausted`);
    }

    const ncf = `${range.prefix}${String(range.current_number).padStart(8, '0')}`;
    await updateCurrentNumber(range.id, range.current_number + 1);

    return ncf;
}

async function getNCFConfig() {
    const [rows] = await pool.query("SELECT * FROM ncf_config LIMIT 1");
    return rows[0] || null;
}

async function updateNCFConfig(data) {
    const existing = await getNCFConfig();

    if (existing) {
        const [result] = await pool.query(
            `UPDATE ncf_config 
            SET email_607_1 = ?,
                email_607_2 = ?,
                email_607_3 = ?,
                selected_period = ?,
                auto_apply_itbis = ?,
                default_ncf_type = ?
            WHERE id = ?`,
            [
                data.email_607_1,
                data.email_607_2,
                data.email_607_3,
                data.selected_period,
                data.auto_apply_itbis,
                data.default_ncf_type,
                existing.id
            ]
        );
        return result.affectedRows;
    } else {
        const [result] = await pool.query(
            `INSERT INTO ncf_config 
            (email_607_1, email_607_2, email_607_3, selected_period, auto_apply_itbis, default_ncf_type) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                data.email_607_1,
                data.email_607_2,
                data.email_607_3,
                data.selected_period,
                data.auto_apply_itbis,
                data.default_ncf_type
            ]
        );
        return result.insertId;
    }
}

module.exports = {
    getAllNCFRanges,
    getNCFRangeById,
    getNCFRangeByType,
    createNCFRange,
    updateNCFRange,
    updateCurrentNumber,
    getNextNCF,
    getNCFConfig,
    updateNCFConfig
};
