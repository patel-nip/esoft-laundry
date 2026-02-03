const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require("../models/userModel");
const { getUserBranch } = require("../middleware/authMiddleware"); // ✅ Added

async function listUsers(req, res) {
    try {
        const branchId = getUserBranch(req); // ✅ Get user's branch
        const users = await getAllUsers(branchId); // ✅ Pass branchId
        res.json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
}

async function getUser(req, res) {
    try {
        const branchId = getUserBranch(req); // ✅ Get user's branch
        const user = await getUserById(req.params.id, branchId); // ✅ Pass branchId
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Failed to fetch user" });
    }
}

async function addUser(req, res) {
    try {
        const { username, password, name, email, phone, role, branch_id, status } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // ✅ Use provided branch_id or user's own branch
        const userBranchId = branch_id || req.user.branch_id;

        if (!userBranchId && req.user.role !== 'SUPER_ADMIN') {
            return res.status(400).json({ message: "Branch ID is required" });
        }

        const newId = await createUser({
            username,
            password,
            name,
            email,
            phone,
            role,
            branch_id: userBranchId, // ✅ Changed from 'branch' to 'branch_id'
            status
        });

        const newUser = await getUserById(newId);
        res.status(201).json({ message: "User created", user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Username already exists" });
        }
        res.status(500).json({ message: "Failed to create user" });
    }
}

async function editUser(req, res) {
    try {
        const { username, password, name, email, phone, role, branch_id, status } = req.body;

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const branchId = getUserBranch(req); // ✅ Get user's branch

        const updated = await updateUser(req.params.id, {
            username,
            password,
            name,
            email,
            phone,
            role,
            branch_id, // ✅ Changed from 'branch' to 'branch_id'
            status
        }, branchId); // ✅ Pass branchId

        if (updated === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = await getUserById(req.params.id, branchId);
        res.json({ message: "User updated", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Failed to update user" });
    }
}

async function removeUser(req, res) {
    try {
        const branchId = getUserBranch(req); // ✅ Get user's branch
        const deleted = await deleteUser(req.params.id, branchId); // ✅ Pass branchId
        if (deleted === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Failed to delete user" });
    }
}

module.exports = {
    listUsers,
    getUser,
    addUser,
    editUser,
    removeUser
};
