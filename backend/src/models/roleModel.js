const pool = require("../config/db");

const AVAILABLE_MODULES = [
    { id: 'dashboard', label: 'Dashboard' }, // ✅ Added
    { id: 'branches', label: 'Branches' }, // ✅ Added (Super Admin only)
    { id: 'create_order', label: 'Create Order' },
    { id: 'order_status', label: 'Order Status' },
    { id: 'invoice_order', label: 'Invoice Order' },
    { id: 'reports', label: 'Reports' },
    { id: 'configuration', label: 'Configuration' },
    { id: 'backup', label: 'Backup' },
    { id: 'roles', label: 'Roles' },
    { id: 'users', label: 'Users' },
    { id: 'printers', label: 'Printers' },
    { id: 'company', label: 'Company' },
    { id: 'tax_receipts', label: 'Tax Receipts (NCF)' },
    { id: 'invoice_message', label: 'Invoice Message' },
    { id: 'service_prices', label: 'Service Prices' }
];

// ✅ FIXED: Changed to match your actual roles
const AVAILABLE_ROLES = ['SUPER_ADMIN', 'BRANCH_MANAGER', 'CASHIER', 'OPERATOR', 'SPECIAL'];

async function getAllPermissions() {
    const [rows] = await pool.query(`
        SELECT 
            role,
            module,
            can_access
        FROM role_permissions 
        ORDER BY role, module
    `);
    return rows;
}

async function getPermissionsByRole(role) {
    const [rows] = await pool.query(
        "SELECT module, can_access FROM role_permissions WHERE role = ?",
        [role]
    );
    return rows;
}

async function updatePermission(role, module, canAccess) {
    const [result] = await pool.query(
        `INSERT INTO role_permissions (role, module, can_access) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE can_access = ?`,
        [role, module, canAccess, canAccess]
    );
    return result.affectedRows;
}

async function updateBulkPermissions(permissions) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        for (const perm of permissions) {
            await connection.query(
                `INSERT INTO role_permissions (role, module, can_access) 
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE can_access = ?`,
                [perm.role, perm.module, perm.can_access, perm.can_access]
            );
        }

        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function checkPermission(role, module) {
    const [rows] = await pool.query(
        "SELECT can_access FROM role_permissions WHERE role = ? AND module = ?",
        [role, module]
    );
    return rows[0]?.can_access || false;
}

module.exports = {
    AVAILABLE_MODULES,
    AVAILABLE_ROLES,
    getAllPermissions,
    getPermissionsByRole,
    updatePermission,
    updateBulkPermissions,
    checkPermission
};
