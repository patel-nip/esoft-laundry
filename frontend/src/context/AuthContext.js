import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, authHelpers } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(true);

    // Load user and permissions on mount
    useEffect(() => {
        loadUserData();
    }, []);

    async function loadUserData() {
        const token = authHelpers.getToken();

        if (!token) {
            setLoading(false);
            return;
        }

        // Check session expiry
        const lastActivity = localStorage.getItem('last_activity');
        if (lastActivity) {
            const now = Date.now();
            const tenMinutes = 10 * 60 * 1000;

            if (now - parseInt(lastActivity) > tenMinutes) {
                console.log('Session expired, clearing token');
                authHelpers.removeToken();
                localStorage.removeItem('last_activity');
                setLoading(false);
                return;
            }
        }

        try {
            const data = await authAPI.getMe();
            setUser(data.user);
            setPermissions(data.permissions || {});
            console.log('✅ User loaded:', data.user.username, 'Role:', data.user.role);
            console.log('✅ Permissions:', data.permissions);
        } catch (error) {
            console.error('Failed to load user data:', error);
            // Token might be invalid, clear it
            authHelpers.removeToken();
            localStorage.removeItem('last_activity');
            setUser(null);
            setPermissions({});
        } finally {
            setLoading(false);
        }
    }

    function login(userData, userPermissions) {
        console.log('🔐 Login called with:', userData.username, userPermissions);
        setUser(userData);
        setPermissions(userPermissions || {});
    }

    function logout() {
        console.log('🚪 Logout called');
        authHelpers.removeToken();
        localStorage.removeItem('last_activity');
        setUser(null);
        setPermissions({});
    }

    function hasPermission(module) {
        // If no module specified, just check if user is logged in
        if (!module) return !!user;

        // Check if user has permission for this module
        const result = permissions[module] === true;
        console.log(`🔍 Checking permission for ${module}:`, result);
        return result;
    }

    const value = {
        user,
        permissions,
        loading,
        login,
        logout,
        hasPermission,
        refreshUserData: loadUserData
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
