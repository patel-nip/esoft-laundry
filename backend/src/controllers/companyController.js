const { getCompanyInfo, updateCompanyInfo } = require("../models/companyModel");

async function getCompany(req, res) {
    try {
        const company = await getCompanyInfo();
        if (!company) {
            return res.status(404).json({ message: "Company info not found" });
        }
        res.json({ company });
    } catch (error) {
        console.error("Error fetching company info:", error);
        res.status(500).json({ message: "Failed to fetch company info" });
    }
}

async function updateCompany(req, res) {
    try {
        const { company_name, slogan, address, phone, phone2, email, website, rnc, schedule, logo_url } = req.body;

        if (!company_name) {
            return res.status(400).json({ message: "Company name is required" });
        }

        await updateCompanyInfo({
            company_name,
            slogan,
            address,
            phone,
            phone2,
            email,
            website,
            rnc,
            schedule,
            logo_url
        });

        const updatedCompany = await getCompanyInfo();
        res.json({ message: "Company info updated", company: updatedCompany });
    } catch (error) {
        console.error("Error updating company info:", error);
        res.status(500).json({ message: "Failed to update company info" });
    }
}

module.exports = {
    getCompany,
    updateCompany
};
