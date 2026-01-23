import React, { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import RolePermissionMatrix from "../../components/settings/RolePermissionMatrix";
import { rolesAPI } from "../../services/api";

function RolesPage() {
    const [modules, setModules] = useState([]);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [pendingChanges, setPendingChanges] = useState([]);

    useEffect(() => {
        fetchPermissionMatrix();
    }, []);

    async function fetchPermissionMatrix() {
        setLoading(true);
        setError("");
        try {
            const data = await rolesAPI.getMatrix();
            setModules(data.modules);
            setRoles(data.roles);
            setPermissions(data.permissions);
            setPendingChanges([]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handlePermissionChange(role, moduleId, newValue) {
        setPermissions(prev => ({
            ...prev,
            [role]: {
                ...prev[role],
                [moduleId]: newValue
            }
        }));

        setPendingChanges(prev => {
            const existingIndex = prev.findIndex(
                item => item.role === role && item.module === moduleId
            );

            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = { role, module: moduleId, can_access: newValue };
                return updated;
            } else {
                return [...prev, { role, module: moduleId, can_access: newValue }];
            }
        });
    }

    async function handleSaveChanges() {
        if (pendingChanges.length === 0) {
            alert("No changes to save");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");
        try {
            await rolesAPI.updateBulk({ permissions: pendingChanges });
            setSuccess(`Successfully updated ${pendingChanges.length} permission(s)!`);
            setPendingChanges([]);
            setTimeout(() => setSuccess(""), 3000);
            await fetchPermissionMatrix();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    function handleResetChanges() {
        if (pendingChanges.length === 0) {
            return;
        }
        if (window.confirm("Discard all unsaved changes?")) {
            fetchPermissionMatrix();
        }
    }

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="dashboard-main">
                <Header />
                <div>
                    <div className="customers-header-bar">
                        <h1 className="customers-title">Roles & Permissions</h1>
                    </div>

                    {error && (
                        <div style={{ padding: "12px 20px", background: "#991b1b", color: "#fecaca", marginBottom: "16px" }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div style={{ padding: "12px 20px", background: "#166534", color: "#bbf7d0", marginBottom: "16px" }}>
                            {success}
                        </div>
                    )}

                    {pendingChanges.length > 0}

                    <div style={{ background: "#1e293b", padding: "16px", borderRadius: "14px", margin: "60px 100px 60px 100px" }}>
                        {loading ? (
                            <div style={{ padding: 20, textAlign: "center" }}>Loading permissions...</div>
                        ) : (
                            <>
                                <div style={{ marginBottom: 16, color: "#94a3b8", fontSize: 14 }}>
                                    <p>
                                        Configure which roles can access different areas of the system.
                                        Check the boxes to grant access, uncheck to deny.
                                    </p>
                                    <p style={{ marginTop: 8 }}>
                                        <strong>Roles:</strong> ADMIN (Administrator), CASHIER (Cashier), OPERATOR (Operator), SPECIAL (Special Access)
                                    </p>
                                </div>

                                <RolePermissionMatrix
                                    modules={modules}
                                    roles={roles}
                                    permissions={permissions}
                                    onPermissionChange={handlePermissionChange}
                                    loading={saving}
                                />
                                {pendingChanges.length > 0 && (
                                    <div style={{
                                        padding: "16px 20px",
                                        background: "#854d0e",
                                        color: "#fef08a",
                                        marginTop: "20px",
                                        borderRadius: "6px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between"
                                    }}>
                                        <span>⚠️ You have {pendingChanges.length} unsaved change(s)</span>
                                    </div>
                                )}

                                <div style={{
                                    display: "flex",
                                    gap: 12,
                                    marginTop: 20,
                                    paddingTop: 20,
                                    borderTop: "1px solid #334155",
                                    justifyContent: "flex-end"
                                }}>
                                    {pendingChanges.length > 0 && (
                                        <button
                                            className="button-secondary"
                                            type="button"
                                            onClick={handleResetChanges}
                                            disabled={saving}
                                        >
                                            Reset Changes
                                        </button>
                                    )}
                                    <button
                                        className="button-primary"
                                        type="button"
                                        onClick={handleSaveChanges}
                                        disabled={saving || pendingChanges.length === 0}
                                    >
                                        {saving ? "Saving..." : `Save Changes ${pendingChanges.length > 0 ? `(${pendingChanges.length})` : ""}`}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default RolesPage;
