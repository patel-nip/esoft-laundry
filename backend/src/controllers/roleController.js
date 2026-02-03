const {
    AVAILABLE_MODULES,
    AVAILABLE_ROLES,
    getAllPermissions,
    getPermissionsByRole,
    updatePermission,
    updateBulkPermissions
} = require("../models/roleModel");

// ✅ NEW: Define which roles each user type can manage
const MANAGEABLE_ROLES = {
    SUPER_ADMIN: ['SUPER_ADMIN', 'BRANCH_MANAGER', 'CASHIER', 'OPERATOR', 'SPECIAL'],
    BRANCH_MANAGER: ['CASHIER', 'OPERATOR', 'SPECIAL'], // Can't modify admin roles
    CASHIER: [],
    OPERATOR: [],
    SPECIAL: []
};

async function getPermissionMatrix(req, res) {
    try {
        const userRole = req.user.role; // ✅ Get logged-in user's role
        const allowedRoles = MANAGEABLE_ROLES[userRole] || []; // ✅ Get roles user can manage

        const permissions = await getAllPermissions();

        const matrix = {};
        // ✅ CHANGED: Only show roles user can manage
        allowedRoles.forEach(role => {
            matrix[role] = {};
            AVAILABLE_MODULES.forEach(module => {
                matrix[role][module.id] = false;
            });
        });

        permissions.forEach(perm => {
            if (matrix[perm.role]) {
                matrix[perm.role][perm.module] = perm.can_access;
            }
        });

        res.json({
            modules: AVAILABLE_MODULES,
            roles: allowedRoles, // ✅ CHANGED: Return only allowed roles
            permissions: matrix
        });
    } catch (error) {
        console.error("Error fetching permission matrix:", error);
        res.status(500).json({ message: "Failed to fetch permissions" });
    }
}

async function getRolePermissions(req, res) {
    try {
        const { role } = req.params;
        const userRole = req.user.role; // ✅ NEW
        const allowedRoles = MANAGEABLE_ROLES[userRole] || []; // ✅ NEW

        // ✅ NEW: Check if user can manage this role
        if (!allowedRoles.includes(role)) {
            return res.status(403).json({ message: "You don't have permission to view this role" });
        }

        if (!AVAILABLE_ROLES.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const permissions = await getPermissionsByRole(role);

        const permissionMap = {};
        permissions.forEach(perm => {
            permissionMap[perm.module] = perm.can_access;
        });

        res.json({
            role,
            permissions: permissionMap
        });
    } catch (error) {
        console.error("Error fetching role permissions:", error);
        res.status(500).json({ message: "Failed to fetch role permissions" });
    }
}

async function updateSinglePermission(req, res) {
    try {
        const { role, module, can_access } = req.body;
        const userRole = req.user.role; // ✅ NEW
        const allowedRoles = MANAGEABLE_ROLES[userRole] || []; // ✅ NEW

        // ✅ NEW: Check if user can manage this role
        if (!allowedRoles.includes(role)) {
            return res.status(403).json({ message: "You don't have permission to modify this role" });
        }

        if (!AVAILABLE_ROLES.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const moduleExists = AVAILABLE_MODULES.find(m => m.id === module);
        if (!moduleExists) {
            return res.status(400).json({ message: "Invalid module" });
        }

        await updatePermission(role, module, can_access);
        res.json({ message: "Permission updated successfully" });
    } catch (error) {
        console.error("Error updating permission:", error);
        res.status(500).json({ message: "Failed to update permission" });
    }
}

async function updateMultiplePermissions(req, res) {
    try {
        const { permissions } = req.body;
        const userRole = req.user.role; // ✅ NEW
        const allowedRoles = MANAGEABLE_ROLES[userRole] || []; // ✅ NEW

        if (!Array.isArray(permissions) || permissions.length === 0) {
            return res.status(400).json({ message: "Permissions array is required" });
        }

        for (const perm of permissions) {
            // ✅ NEW: Check if user can manage this role
            if (!allowedRoles.includes(perm.role)) {
                return res.status(403).json({ 
                    message: `You don't have permission to modify ${perm.role} role` 
                });
            }

            if (!AVAILABLE_ROLES.includes(perm.role)) {
                return res.status(400).json({ message: `Invalid role: ${perm.role}` });
            }
            const moduleExists = AVAILABLE_MODULES.find(m => m.id === perm.module);
            if (!moduleExists) {
                return res.status(400).json({ message: `Invalid module: ${perm.module}` });
            }
        }

        await updateBulkPermissions(permissions);
        res.json({ message: "Permissions updated successfully" });
    } catch (error) {
        console.error("Error updating permissions:", error);
        res.status(500).json({ message: "Failed to update permissions" });
    }
}

module.exports = {
    getPermissionMatrix,
    getRolePermissions,
    updateSinglePermission,
    updateMultiplePermissions
};
