const { getCompanyInfo, updateCompanyInfo, getAllCompanyInfo } = require("../models/companyModel");
const { getUserBranch } = require("../middleware/authMiddleware");

async function getCompany(req, res) {
    try {
        const branchId = getUserBranch(req); // ✅ Get user's branch
        const company = await getCompanyInfo(branchId); // ✅ Pass branchId
        
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

        const branchId = req.user.branch_id; // ✅ Get user's branch

        if (!branchId) {
            return res.status(400).json({ message: "Branch ID is required" });
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
        }, branchId); // ✅ Pass branchId

        const updatedCompany = await getCompanyInfo(branchId);
        res.json({ message: "Company info updated", company: updatedCompany });
    } catch (error) {
        console.error("Error updating company info:", error);
        res.status(500).json({ message: "Failed to update company info" });
    }
}

// ✅ NEW: Get all company info (Super Admin only)
async function listAllCompanies(req, res) {
    try {
        // Only Super Admin can see all companies
        if (req.user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ message: "Access denied" });
        }

        const companies = await getAllCompanyInfo();
        res.json({ companies });
    } catch (error) {
        console.error("Error fetching all company info:", error);
        res.status(500).json({ message: "Failed to fetch company info" });
    }
}

module.exports = {
    getCompany,
    updateCompany,
    listAllCompanies  // ✅ Export new function
};
