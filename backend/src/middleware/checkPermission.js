const { checkPermission: checkPermissionInDB } = require("../models/roleModel");

/**
 * Middleware to check if user has permission to access a module
 * Usage: router.get('/orders', authRequired, checkPermission('order_status'), listOrders)
 */
function checkPermission(requiredModule) {
    return async (req, res, next) => {
        try {
            // User is attached by authRequired middleware
            if (!req.user || !req.user.role) {
                return res.status(401).json({ message: "Authentication required" });
            }

            const { role } = req.user;

            // ✅ Use renamed function to avoid conflict
            const hasPermission = await checkPermissionInDB(role, requiredModule);

            if (!hasPermission) {
                return res.status(403).json({ 
                    message: "Access denied. You don't have permission to access this resource.",
                    requiredPermission: requiredModule,
                    userRole: role
                });
            }

            // User has permission, proceed
            next();
        } catch (error) {
            console.error("Permission check error:", error);
            return res.status(500).json({ message: "Error checking permissions" });
        }
    };
}

module.exports = {
    checkPermission,
};
