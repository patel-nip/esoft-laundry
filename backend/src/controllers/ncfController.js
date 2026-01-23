const {
    getAllNCFRanges,
    getNCFRangeById,
    createNCFRange,
    updateNCFRange,
    getNextNCF,
    getNCFConfig,
    updateNCFConfig
} = require("../models/ncfRangeModel");

async function listNCFRanges(req, res) {
    try {
        const ranges = await getAllNCFRanges();
        const config = await getNCFConfig();
        res.json({ ranges, config });
    } catch (error) {
        console.error("Error fetching NCF ranges:", error);
        res.status(500).json({ message: "Failed to fetch NCF ranges" });
    }
}

async function getNCFRange(req, res) {
    try {
        const range = await getNCFRangeById(req.params.id);
        if (!range) {
            return res.status(404).json({ message: "NCF range not found" });
        }
        res.json({ range });
    } catch (error) {
        console.error("Error fetching NCF range:", error);
        res.status(500).json({ message: "Failed to fetch NCF range" });
    }
}

async function addNCFRange(req, res) {
    try {
        const { series_type, prefix, start_number, end_number, current_number, status } = req.body;

        if (!series_type || !prefix || !start_number || !end_number) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newId = await createNCFRange({
            series_type,
            prefix,
            start_number,
            end_number,
            current_number,
            status
        });

        const newRange = await getNCFRangeById(newId);
        res.status(201).json({ message: "NCF range created", range: newRange });
    } catch (error) {
        console.error("Error creating NCF range:", error);
        res.status(500).json({ message: "Failed to create NCF range" });
    }
}

async function editNCFRange(req, res) {
    try {
        const { series_type, prefix, start_number, end_number, current_number, status } = req.body;

        if (!series_type || !prefix || !start_number || !end_number) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const updated = await updateNCFRange(req.params.id, {
            series_type,
            prefix,
            start_number,
            end_number,
            current_number,
            status
        });

        if (updated === 0) {
            return res.status(404).json({ message: "NCF range not found" });
        }

        const updatedRange = await getNCFRangeById(req.params.id);
        res.json({ message: "NCF range updated", range: updatedRange });
    } catch (error) {
        console.error("Error updating NCF range:", error);
        res.status(500).json({ message: "Failed to update NCF range" });
    }
}

async function getConfig(req, res) {
    try {
        const config = await getNCFConfig();
        res.json({ config });
    } catch (error) {
        console.error("Error fetching NCF config:", error);
        res.status(500).json({ message: "Failed to fetch NCF config" });
    }
}

async function updateConfig(req, res) {
    try {
        const { email_607_1, email_607_2, email_607_3, selected_period, auto_apply_itbis, default_ncf_type } = req.body;

        await updateNCFConfig({
            email_607_1,
            email_607_2,
            email_607_3,
            selected_period,
            auto_apply_itbis,
            default_ncf_type
        });

        const updatedConfig = await getNCFConfig();
        res.json({ message: "NCF config updated", config: updatedConfig });
    } catch (error) {
        console.error("Error updating NCF config:", error);
        res.status(500).json({ message: "Failed to update NCF config" });
    }
}

module.exports = {
    listNCFRanges,
    getNCFRange,
    addNCFRange,
    editNCFRange,
    getConfig,
    updateConfig
};
