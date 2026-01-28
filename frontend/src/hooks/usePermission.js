import { useAuth } from '../context/AuthContext';

/**
 * Hook to check if current user has permission for a module
 * Usage: const canAccess = usePermission('create_order');
 */
export function usePermission(module) {
    const { hasPermission } = useAuth();
    return hasPermission(module);
}

/**
 * Hook to check multiple permissions at once
 * Usage: const { canCreate, canView } = usePermissions({ canCreate: 'create_order', canView: 'order_status' });
 */
export function usePermissions(permissionMap) {
    const { hasPermission } = useAuth();

    const result = {};
    Object.keys(permissionMap).forEach(key => {
        result[key] = hasPermission(permissionMap[key]);
    });

    return result;
}
