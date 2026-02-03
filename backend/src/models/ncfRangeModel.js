const pool = require("../config/db");

// ✅ Get all NCF ranges (filtered by branch)
async function getAllNCFRanges(branchId = null) {
    let query = `
        SELECT 
            id,
            series_type,
            series,
            prefix,
            start_number,
            end_number,
            current_number,
            is_active,
            branch_id,
            created_at
        FROM ncf_ranges
    `;
    let params = [];

    if (branchId) {
        query += " WHERE branch_id = ?";
        params.push(branchId);
    }

    query += " ORDER BY series_type";

    const [rows] = await pool.query(query, params);

    // Transform for frontend
    return rows.map(row => ({
        id: row.id,
        series_type: row.series_type,
        series: row.series,
        prefix: row.prefix,
        start_number: row.start_number,
        end_number: row.end_number,
        current_number: row.current_number,
        status: row.is_active === 'YES' ? 'ACTIVE' : 'INACTIVE',
        branch_id: row.branch_id,
        created_at: row.created_at
    }));
}

// ✅ Get NCF range by ID (with branch check)
async function getNCFRangeById(id, branchId = null) {
    let query = "SELECT * FROM ncf_ranges WHERE id = ?";
    let params = [id];

    if (branchId) {
        query += " AND branch_id = ?";
        params.push(branchId);
    }

    const [rows] = await pool.query(query, params);

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
        id: row.id,
        series_type: row.series_type,
        series: row.series,
        prefix: row.prefix,
        start_number: row.start_number,
        end_number: row.end_number,
        current_number: row.current_number,
        status: row.is_active === 'YES' ? 'ACTIVE' : 'INACTIVE',
        branch_id: row.branch_id
    };
}

// ✅ Get NCF range by type (with branch check)
async function getNCFRangeByType(seriesType, branchId) {
    let query = "SELECT * FROM ncf_ranges WHERE series_type = ? AND is_active = 'YES'";
    let params = [seriesType];

    if (branchId) {
        query += " AND branch_id = ?";
        params.push(branchId);
    }

    query += " LIMIT 1";

    const [rows] = await pool.query(query, params);
    return rows[0] || null;
}

// ✅ Create NCF range (with branch_id)
async function createNCFRange(data, branchId) {
    const [result] = await pool.query(
        `INSERT INTO ncf_ranges 
        (series_type, series, prefix, start_number, end_number, current_number, is_active, branch_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.series_type,
            data.series || '00000',
            data.prefix,
            data.start_number,
            data.end_number,
            data.current_number || data.start_number,
            data.status === 'ACTIVE' ? 'YES' : 'NO',
            branchId
        ]
    );
    return result.insertId;
}

// ✅ Update NCF range (with branch check)
async function updateNCFRange(id, data, branchId = null) {
    let query = `UPDATE ncf_ranges 
        SET series_type = ?,
            series = ?,
            prefix = ?,
            start_number = ?,
            end_number = ?,
            current_number = ?,
            is_active = ?
        WHERE id = ?`;

    let params = [
        data.series_type,
        data.series || '00000',
        data.prefix,
        data.start_number,
        data.end_number,
        data.current_number,
        data.status === 'ACTIVE' ? 'YES' : 'NO',
        id
    ];

    if (branchId) {
        query += " AND branch_id = ?";
        params.push(branchId);
    }

    const [result] = await pool.query(query, params);
    return result.affectedRows;
}

// ✅ Update current number (with branch check)
async function updateCurrentNumber(id, newNumber, branchId = null) {
    let query = "UPDATE ncf_ranges SET current_number = ? WHERE id = ?";
    let params = [newNumber, id];

    if (branchId) {
        query += " AND branch_id = ?";
        params.push(branchId);
    }

    const [result] = await pool.query(query, params);
    return result.affectedRows;
}

// ✅ Generate next NCF number (branch-specific)
async function getNextNCF(seriesType, branchId) {
    const range = await getNCFRangeByType(seriesType, branchId);

    if (!range) {
        throw new Error(`No active NCF range found for type ${seriesType} in this branch`);
    }

    if (range.current_number > range.end_number) {
        throw new Error(`NCF range exhausted for ${seriesType}. Please add a new range.`);
    }

    // Format: Prefix + Series + Current (padded to 8 digits)
    // Example: B02 + 00000 + 00000133 = B0200000000000133
    const paddedNumber = String(range.current_number).padStart(8, '0');
    const ncfNumber = `${range.prefix}${range.series}${paddedNumber}`;

    // Increment current number
    await updateCurrentNumber(range.id, range.current_number + 1, branchId);

    return ncfNumber;
}

// ✅ Get NCF config (branch-specific)
async function getNCFConfig(branchId = null) {
    let query = "SELECT * FROM ncf_config";
    let params = [];

    if (branchId) {
        query += " WHERE branch_id = ?";
        params.push(branchId);
    }

    query += " LIMIT 1";

    const [rows] = await pool.query(query, params);
    return rows[0] || null;
}

// ✅ Update NCF config (branch-specific)
async function updateNCFConfig(data, branchId) {
    const existing = await getNCFConfig(branchId);

    if (existing) {
        let query = `UPDATE ncf_config 
            SET email_607_1 = ?,
                email_607_2 = ?,
                email_607_3 = ?,
                selected_period = ?,
                auto_apply_itbis = ?,
                default_ncf_type = ?
            WHERE id = ?`;

        let params = [
            data.email_607_1,
            data.email_607_2,
            data.email_607_3,
            data.selected_period,
            data.auto_apply_itbis,
            data.default_ncf_type,
            existing.id
        ];

        if (branchId) {
            query += " AND branch_id = ?";
            params.push(branchId);
        }

        const [result] = await pool.query(query, params);
        return result.affectedRows;
    } else {
        const [result] = await pool.query(
            `INSERT INTO ncf_config 
            (email_607_1, email_607_2, email_607_3, selected_period, auto_apply_itbis, default_ncf_type, branch_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                data.email_607_1,
                data.email_607_2,
                data.email_607_3,
                data.selected_period,
                data.auto_apply_itbis,
                data.default_ncf_type,
                branchId
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
