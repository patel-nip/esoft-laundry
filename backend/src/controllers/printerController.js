const { getPrinterSettings, updatePrinterSettings } = require("../models/printerModel");
const { getUserBranch } = require("../middleware/authMiddleware"); // ✅ Added

async function getSettings(req, res) {
    try {
        const branchId = getUserBranch(req); // ✅ Get user's branch
        const settings = await getPrinterSettings(branchId); // ✅ Pass branchId
        
        res.json({ settings });
    } catch (error) {
        console.error("Error fetching printer settings:", error);
        res.status(500).json({ message: "Failed to fetch printer settings" });
    }
}

async function updateSettings(req, res) {
    try {
        const { invoice_printer, invoice_paper_type, report_printer, report_paper_type } = req.body;
        const branchId = getUserBranch(req); // ✅ Get user's branch

        await updatePrinterSettings({
            invoice_printer: invoice_printer || "Microsoft Print to PDF",
            invoice_paper_type: invoice_paper_type || "Thermal Paper",
            report_printer: report_printer || "Microsoft Print to PDF",
            report_paper_type: report_paper_type || "Thermal Paper"
        }, branchId); // ✅ Pass branchId

        const updatedSettings = await getPrinterSettings(branchId);
        res.json({ message: "Printer settings updated", settings: updatedSettings });
    } catch (error) {
        console.error("Error updating printer settings:", error);
        res.status(500).json({ message: "Failed to update printer settings" });
    }
}

module.exports = {
    getSettings,
    updateSettings
};
