const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require("../models/userModel");

async function listUsers(req, res) {
    try {
        const users = await getAllUsers();
        res.json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
}

async function getUser(req, res) {
    try {
        const user = await getUserById(req.params.id);
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
        const { username, password, name, email, phone, role, branch, status } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const newId = await createUser({
            username,
            password,
            name,
            email,
            phone,
            role,
            branch,
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
        const { username, password, name, email, phone, role, branch, status } = req.body;

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const updated = await updateUser(req.params.id, {
            username,
            password,
            name,
            email,
            phone,
            role,
            branch,
            status
        });

        if (updated === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = await getUserById(req.params.id);
        res.json({ message: "User updated", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Failed to update user" });
    }
}

async function removeUser(req, res) {
    try {
        const deleted = await deleteUser(req.params.id);
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
