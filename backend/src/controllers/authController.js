const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
    findUserByUsername,
    createUser,
} = require("../models/userModel");

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

        res.json({ user: req.user });
    } catch (err) {
        return res.status(500).json({ message: "Error getting current user" });
    }
}

module.exports = {
    login,
    register,
    getMe,
};
