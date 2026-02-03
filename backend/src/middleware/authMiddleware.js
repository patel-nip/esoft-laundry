const jwt = require("jsonwebtoken");

function authRequired(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            username: decoded.username,
            role: decoded.role,
            branch_id: decoded.branch_id,        // ✅ Add branch_id
            branch_name: decoded.branch_name,    // ✅ Add branch_name
        };
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

// ✅ NEW: Middleware to check if user is Super Admin
function isSuperAdmin(req, res, next) {
    if (req.user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ 
            error: 'Access denied. Super Admin only.' 
        });
    }
    next();
}

// ✅ NEW: Middleware to get user's branch (for filtering queries)
function getUserBranch(req) {
    // Super Admin can access all branches unless they specify one
    if (req.user.role === 'SUPER_ADMIN') {
        // Check if Super Admin selected a specific branch
        return req.query.branch_id || req.body.branch_id || null;
    }
    // Regular users always use their assigned branch
    return req.user.branch_id;
}

module.exports = {
    authRequired,
    isSuperAdmin,       // ✅ Export new middleware
    getUserBranch,      // ✅ Export helper function
    // Keep old name for backward compatibility
    authenticateToken: authRequired,
};
