const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
    findUserByUsername,
    createUser,
} = require("../models/userModel");
const { getPermissionsByRole } = require("../models/roleModel");

function signJwtForUser(user) {
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
        branch: user.branch,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });
}

// POST /api/auth/login
async function login(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const user = await findUserByUsername(username);

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = signJwtForUser(user);

        // ✅ Fetch user permissions
        const permissions = await getPermissionsByRole(user.role);
        const permissionMap = {};
        permissions.forEach(perm => {
            // ✅ Convert to boolean and ensure consistent format
            permissionMap[perm.module] = Boolean(perm.can_access);
        });

        console.log('📋 Login - User:', user.username, 'Role:', user.role);
        console.log('🔑 Login - Permissions:', permissionMap);

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
                branch: user.branch,
            },
            permissions: permissionMap  // ✅ Return permissions on login
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Server error during login" });
    }
}

// POST /api/auth/register (admin only - optional for now)
async function register(req, res) {
    try {
        const { username, password, name, email, phone, role, branch } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const existingUser = await findUserByUsername(username);

        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await createUser(
            username,
            passwordHash,
            name || null,
            email || null,
            phone || null,
            role || "ADMIN",
            branch || "MAIN"
        );

        const token = signJwtForUser(newUser);

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                name: newUser.name,
                role: newUser.role,
                branch: newUser.branch,
            },
        });
    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ message: "Server error during registration" });
    }
}

// GET /api/auth/me
async function getMe(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // ✅ Fetch user's permissions based on their role
        const permissions = await getPermissionsByRole(req.user.role);

        // Convert permissions array to object map with boolean values
        const permissionMap = {};
        permissions.forEach(perm => {
            // ✅ Convert to boolean and ensure consistent format
            permissionMap[perm.module] = Boolean(perm.can_access);
        });

        console.log('📋 GetMe - User:', req.user.username, 'Role:', req.user.role);
        console.log('🔑 GetMe - Permissions:', permissionMap);

        res.json({ 
            user: req.user,
            permissions: permissionMap  // ✅ Add permissions here
        });
    } catch (err) {
        console.error("Error getting current user:", err);
        return res.status(500).json({ message: "Error getting current user" });
    }
}

module.exports = {
    login,
    register,
    getMe,
};
