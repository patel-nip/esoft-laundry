import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccessDenied from './AccessDenied';

/**
 * Protected Route Component
 * Usage: <ProtectedRoute requiredPermission="create_order"><CreateOrderPage /></ProtectedRoute>
 */
function ProtectedRoute({ children, requiredPermission }) {
    const { user, hasPermission, loading } = useAuth();

    // Show loading state while checking auth
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: '#0f172a'
            }}>
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: 18, marginBottom: 8 }}>Loading...</div>
                    <div style={{ fontSize: 14 }}>Checking permissions</div>
                </div>
            </div>
        );
    }

    // Not logged in - redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // No permission required - just need to be logged in
    if (!requiredPermission) {
        return children;
    }

    // Check if user has required permission
    if (!hasPermission(requiredPermission)) {
        return <AccessDenied requiredPermission={requiredPermission} />;
    }

    // User has permission - render the component
    return children;
}

export default ProtectedRoute;
