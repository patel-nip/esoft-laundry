const pool = require("../config/db");

async function getAllNCFRanges() {
    const [rows] = await pool.query(`
        SELECT 
            id,
            series_type,
            series,
            prefix,
            initial_number,
            last_number,
            current_number,
            is_active,
            created_at
        FROM ncf_ranges 
        ORDER BY series_type
    `);
    
    // Transform for frontend
    return rows.map(row => ({
        id: row.id,
        series_type: row.series_type,
        series: row.series,
        prefix: row.prefix,
        start_number: row.initial_number,
        end_number: row.last_number,
        current_number: row.current_number,
        status: row.is_active === 'YES' ? 'ACTIVE' : 'INACTIVE',
        created_at: row.created_at
    }));
}

async function getNCFRangeById(id) {
    const [rows] = await pool.query(
        "SELECT * FROM ncf_ranges WHERE id = ?",
        [id]
    );
    
    if (rows.length === 0) return null;
    
    const row = rows[0];
    return {
        id: row.id,
        series_type: row.series_type,
        series: row.series,
        prefix: row.prefix,
        start_number: row.initial_number,
        end_number: row.last_number,
        current_number: row.current_number,
        status: row.is_active === 'YES' ? 'ACTIVE' : 'INACTIVE'
    };
}

async function getNCFRangeByType(seriesType) {
    const [rows] = await pool.query(
        "SELECT * FROM ncf_ranges WHERE series_type = ? AND is_active = 'YES' LIMIT 1",
        [seriesType]
    );
    return rows[0] || null;
}

async function createNCFRange(data) {
    const [result] = await pool.query(
        `INSERT INTO ncf_ranges 
        (series_type, series, prefix, initial_number, last_number, current_number, is_active) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            data.series_type,
            data.series || '00000',
            data.prefix,
            data.start_number,
            data.end_number,
            data.current_number || data.start_number,
            data.status === 'ACTIVE' ? 'YES' : 'NO'
        ]
    );
    return result.insertId;
}

async function updateNCFRange(id, data) {
    const [result] = await pool.query(
        `UPDATE ncf_ranges 
        SET series_type = ?,
            series = ?,
            prefix = ?,
            initial_number = ?,
            last_number = ?,
            current_number = ?,
            is_active = ?
        WHERE id = ?`,
        [
            data.series_type,
            data.series || '00000',
            data.prefix,
            data.start_number,
            data.end_number,
            data.current_number,
            data.status === 'ACTIVE' ? 'YES' : 'NO',
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

// ✅ NEW: Generate next NCF number
async function getNextNCF(seriesType) {
    const range = await getNCFRangeByType(seriesType);

    if (!range) {
        throw new Error(`No active NCF range found for type ${seriesType}`);
    }

    if (range.current_number > range.last_number) {
        throw new Error(`NCF range exhausted for ${seriesType}. Please add a new range.`);
    }

    // Format: Prefix + Series + Current (padded to 8 digits)
    // Example: B02 + 00000 + 133 = B0200000133
    const ncfNumber = `${range.prefix}${range.series}${String(range.current_number).padStart(8, '0')}`;
    
    // Increment current number
    await updateCurrentNumber(range.id, range.current_number + 1);

    return ncfNumber;
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
