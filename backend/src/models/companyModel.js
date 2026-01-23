const pool = require("../config/db");

async function getCompanyInfo() {
    const [rows] = await pool.query("SELECT * FROM company_info LIMIT 1");
    return rows[0] || null;
}

async function updateCompanyInfo(data) {
    const existing = await getCompanyInfo();

    if (existing) {
        const [result] = await pool.query(
            `UPDATE company_info 
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
            WHERE id = ?`,
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
                existing.id
            ]
        );
        return result.affectedRows;
    } else {
        const [result] = await pool.query(
            `INSERT INTO company_info 
            (company_name, slogan, address, phone, phone2, email, website, rnc, schedule, logo_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                data.logo_url
            ]
        );
        return result.insertId;
    }
}

module.exports = {
    getCompanyInfo,
    updateCompanyInfo
};
