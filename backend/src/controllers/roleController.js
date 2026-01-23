const {
    AVAILABLE_MODULES,
    AVAILABLE_ROLES,
    getAllPermissions,
    getPermissionsByRole,
    updatePermission,
    updateBulkPermissions
} = require("../models/roleModel");

async function getPermissionMatrix(req, res) {
    try {
        const permissions = await getAllPermissions();

        const matrix = {};
        AVAILABLE_ROLES.forEach(role => {
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
            roles: AVAILABLE_ROLES,
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

        if (!Array.isArray(permissions) || permissions.length === 0) {
            return res.status(400).json({ message: "Permissions array is required" });
        }

        for (const perm of permissions) {
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
