const {
    getAllCustomers,
    findCustomerById,
    searchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} = require("../models/customerModel");
const { getUserBranch } = require("../middleware/authMiddleware");

async function listCustomers(req, res) {
    try {
        const { search } = req.query;
        const branchId = getUserBranch(req); // ✅ Get user's branch

        let customers;
        if (search) {
            customers = await searchCustomers(search, branchId);
        } else {
            customers = await getAllCustomers(branchId);
        }

        res.json({ customers });
    } catch (err) {
        console.error("List customers error:", err);
        res.status(500).json({ message: "Error fetching customers" });
    }
}

async function getCustomer(req, res) {
    try {
        const branchId = getUserBranch(req); // ✅ Get user's branch
        const customer = await findCustomerById(req.params.id, branchId);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json({ customer });
    } catch (err) {
        console.error("Get customer error:", err);
        res.status(500).json({ message: "Error fetching customer" });
    }
}

async function addCustomer(req, res) {
    try {
        const { code, name, phone, phone2, address, rnc } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ message: "Name and phone are required" });
        }

        const branchId = req.user.branch_id; // ✅ Use user's branch

        if (!branchId) {
            return res.status(400).json({ message: "Branch ID is required" });
        }

        const customer = await createCustomer({
            code: code || `C${Date.now()}`,
            name,
            phone,
            phone2,
            address,
            rnc,
        }, branchId); // ✅ Pass branchId

        res.status(201).json({ message: "Customer created", customer });
    } catch (err) {
        console.error("Add customer error:", err);
        res.status(500).json({ message: "Error creating customer" });
    }
}

async function editCustomer(req, res) {
    try {
        const { name, phone, phone2, address, rnc } = req.body;
        const branchId = getUserBranch(req); // ✅ Get user's branch

        const customer = await updateCustomer(req.params.id, {
            name,
            phone,
            phone2,
            address,
            rnc,
        }, branchId); // ✅ Pass branchId

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json({ message: "Customer updated", customer });
    } catch (err) {
        console.error("Edit customer error:", err);
        res.status(500).json({ message: "Error updating customer" });
    }
}

async function removeCustomer(req, res) {
    try {
        const branchId = getUserBranch(req); // ✅ Get user's branch
        await deleteCustomer(req.params.id, branchId); // ✅ Pass branchId
        res.json({ message: "Customer deleted" });
    } catch (err) {
        console.error("Remove customer error:", err);
        res.status(500).json({ message: "Error deleting customer" });
    }
}

module.exports = {
    listCustomers,
    getCustomer,
    addCustomer,
    editCustomer,
    removeCustomer,
};
