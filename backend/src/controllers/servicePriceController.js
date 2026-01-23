const {
    getAllServicePrices,
    getServicePriceById,
    createServicePrice,
    updateServicePrice,
    deleteServicePrice
} = require("../models/servicePriceModel");

async function listServicePrices(req, res) {
    try {
        const prices = await getAllServicePrices();
        res.json({ servicePrices: prices });
    } catch (error) {
        console.error("Error fetching service prices:", error);
        res.status(500).json({ message: "Failed to fetch service prices" });
    }
}

async function getServicePrice(req, res) {
    try {
        const price = await getServicePriceById(req.params.id);
        if (!price) {
            return res.status(404).json({ message: "Service price not found" });
        }
        res.json({ servicePrice: price });
    } catch (error) {
        console.error("Error fetching service price:", error);
        res.status(500).json({ message: "Failed to fetch service price" });
    }
}

async function addServicePrice(req, res) {
    try {
        const { garment_name, wash_iron, wash_iron_white, iron_only, alterations, express_percentage } = req.body;

        if (!garment_name) {
            return res.status(400).json({ message: "Garment name is required" });
        }

        const newId = await createServicePrice({
            garment_name,
            wash_iron,
            wash_iron_white,
            iron_only,
            alterations,
            express_percentage
        });

        const newPrice = await getServicePriceById(newId);
        res.status(201).json({ message: "Service price created", servicePrice: newPrice });
    } catch (error) {
        console.error("Error creating service price:", error);
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Garment name already exists" });
        }
        res.status(500).json({ message: "Failed to create service price" });
    }
}

async function editServicePrice(req, res) {
    try {
        const { garment_name, wash_iron, wash_iron_white, iron_only, alterations, express_percentage } = req.body;

        if (!garment_name) {
            return res.status(400).json({ message: "Garment name is required" });
        }

        const updated = await updateServicePrice(req.params.id, {
            garment_name,
            wash_iron,
            wash_iron_white,
            iron_only,
            alterations,
            express_percentage
        });

        if (updated === 0) {
            return res.status(404).json({ message: "Service price not found" });
        }

        const updatedPrice = await getServicePriceById(req.params.id);
        res.json({ message: "Service price updated", servicePrice: updatedPrice });
    } catch (error) {
        console.error("Error updating service price:", error);
        res.status(500).json({ message: "Failed to update service price" });
    }
}

async function removeServicePrice(req, res) {
    try {
        const deleted = await deleteServicePrice(req.params.id);
        if (deleted === 0) {
            return res.status(404).json({ message: "Service price not found" });
        }
        res.json({ message: "Service price deleted" });
    } catch (error) {
        console.error("Error deleting service price:", error);
        res.status(500).json({ message: "Failed to delete service price" });
    }
}

module.exports = {
    listServicePrices,
    getServicePrice,
    addServicePrice,
    editServicePrice,
    removeServicePrice
};
