const { getInvoiceSettings, updateInvoiceSettings } = require("../models/invoiceSettingsModel");

async function getSettings(req, res) {
    try {
        const settings = await getInvoiceSettings();
        if (!settings) {
            return res.status(404).json({ message: "Invoice settings not found" });
        }
        res.json({ settings });
    } catch (error) {
        console.error("Error fetching invoice settings:", error);
        res.status(500).json({ message: "Failed to fetch invoice settings" });
    }
}

async function updateSettings(req, res) {
    try {
        const { footer_message, terms_and_conditions } = req.body;

        await updateInvoiceSettings({
            footer_message: footer_message || "",
            terms_and_conditions: terms_and_conditions || ""
        });

        const updatedSettings = await getInvoiceSettings();
        res.json({ message: "Invoice settings updated", settings: updatedSettings });
    } catch (error) {
        console.error("Error updating invoice settings:", error);
        res.status(500).json({ message: "Failed to update invoice settings" });
    }
}

module.exports = {
    getSettings,
    updateSettings
};
