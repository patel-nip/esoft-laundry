const pool = require("../config/db");

// ✅ Get company info (branch-specific)
async function getCompanyInfo(branchId = null) {
    let query = "SELECT * FROM company_info";
    let params = [];

    if (branchId) {
        query += " WHERE branch_id = ?";
        params.push(branchId);
    }

    query += " LIMIT 1";

    const [rows] = await pool.query(query, params);
    return rows[0] || null;
}

// ✅ Update company info (branch-specific)
async function updateCompanyInfo(data, branchId) {
    const existing = await getCompanyInfo(branchId);

    if (existing) {
        // Update existing company info
        let query = `UPDATE company_info 
            SET company_name = ?, 
                slogan = ?, 
                address = ?, 
                phone = ?, 
                phone2 = ?, 
                email = ?, 
                website = ?, 
                rnc = ?, 
                schedule = ?,
                logo_url = ?
            WHERE id = ?`;
        
        let params = [
            data.company_name,
            data.slogan,
            data.address,
            data.phone,
            data.phone2,
            data.email,
            data.website,
            data.rnc,
            data.schedule,
            data.logo_url,
            existing.id
        ];

        if (branchId) {
            query += " AND branch_id = ?";
            params.push(branchId);
        }

        const [result] = await pool.query(query, params);
        return result.affectedRows;
    } else {
        // Create new company info
        const [result] = await pool.query(
            `INSERT INTO company_info 
            (company_name, slogan, address, phone, phone2, email, website, rnc, schedule, logo_url, branch_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.company_name,
                data.slogan,
                data.address,
                data.phone,
                data.phone2,
                data.email,
                data.website,
                data.rnc,
                data.schedule,
                data.logo_url,
                branchId
            ]
        );
        return result.insertId;
    }
}

// ✅ Get all company info (Super Admin - see all branches)
async function getAllCompanyInfo() {
    const [rows] = await pool.query(`
        SELECT ci.*, b.name as branch_name, b.branch_code
        FROM company_info ci
        LEFT JOIN branches b ON ci.branch_id = b.id
        ORDER BY b.name
    `);
    return rows;
}

module.exports = {
    getCompanyInfo,
    updateCompanyInfo,
    getAllCompanyInfo
};
