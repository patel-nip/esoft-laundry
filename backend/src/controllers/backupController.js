const { getBackupConfig, updateBackupConfig, updateBackupDates } = require("../models/backupModel");

async function getConfig(req, res) {
    try {
        const config = await getBackupConfig();
        if (!config) {
            return res.status(404).json({ message: "Backup config not found" });
        }
        res.json({ config });
    } catch (error) {
        console.error("Error fetching backup config:", error);
        res.status(500).json({ message: "Failed to fetch backup config" });
    }
}

async function updateConfig(req, res) {
    try {
        const { backup_location, backup_cycle_days, auto_backup_enabled } = req.body;

        await updateBackupConfig({
            backup_location: backup_location || "D:\\Esoft\\Backup\\Base_Datos",
            backup_cycle_days: backup_cycle_days || 5,
            auto_backup_enabled: auto_backup_enabled !== undefined ? auto_backup_enabled : true
        });

        const updatedConfig = await getBackupConfig();
        res.json({ message: "Backup config updated", config: updatedConfig });
    } catch (error) {
        console.error("Error updating backup config:", error);
        res.status(500).json({ message: "Failed to update backup config" });
    }
}

async function triggerBackup(req, res) {
    try {
        const config = await getBackupConfig();
        if (!config) {
            return res.status(404).json({ message: "Backup config not found" });
        }

        const today = new Date();
        const nextBackup = new Date(today);
        nextBackup.setDate(nextBackup.getDate() + (config.backup_cycle_days || 5));

        await updateBackupDates(
            today.toISOString().split('T')[0],
            nextBackup.toISOString().split('T')[0]
        );

        res.json({
            message: "Backup triggered successfully",
            lastBackup: today.toISOString().split('T')[0],
            nextBackup: nextBackup.toISOString().split('T')[0]
        });
    } catch (error) {
        console.error("Error triggering backup:", error);
        res.status(500).json({ message: "Failed to trigger backup" });
    }
}

module.exports = {
    getConfig,
    updateConfig,
    triggerBackup
};
