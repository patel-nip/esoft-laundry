import React from "react";

function RolePermissionMatrix({ modules, roles, permissions, onPermissionChange, loading }) {
    function handleCheckboxChange(role, moduleId, currentValue) {
        onPermissionChange(role, moduleId, !currentValue);
    }

    return (
        <div style={{ overflowX: "auto" }}>
            <table className="order-table" style={{ minWidth: 800 }}>
                <thead>
                    <tr>
                        <th style={{ minWidth: 200 }}>Module / Zone</th>
                        {roles.map(role => (
                            <th key={role} style={{ textAlign: "center", minWidth: 120 }}>
                                {role}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {modules.map((module) => (
                        <tr key={module.id} className="order-row">
                            <td style={{ fontWeight: 500 }}>
                                {module.label}
                            </td>
                            {roles.map(role => {
                                const hasPermission = permissions[role]?.[module.id] || false;
                                return (
                                    <td key={`${role}-${module.id}`} style={{ textAlign: "center" }}>
                                        <input
                                            type="checkbox"
                                            checked={hasPermission}
                                            onChange={() => handleCheckboxChange(role, module.id, hasPermission)}
                                            disabled={loading}
                                            style={{
                                                width: 18,
                                                height: 18,
                                                cursor: loading ? "not-allowed" : "pointer",
                                                accentColor: "#3b82f6"
                                            }}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default RolePermissionMatrix;
