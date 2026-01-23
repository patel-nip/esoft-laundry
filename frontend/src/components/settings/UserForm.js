import React, { useState, useEffect } from "react";

function UserForm({ user, onSave, onClose, loading }) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
        phone: "",
        role: "ADMIN",
        branch: "MAIN",
        status: "ACTIVE"
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                password: "",
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                role: user.role || "ADMIN",
                branch: user.branch || "MAIN",
                status: user.status || "ACTIVE"
            });
        }
    }, [user]);

    function handleChange(field, value) {
        setFormData(prev => ({ ...prev, [field]: value }));
    }

    function handleSubmit() {
        if (!formData.username.trim()) {
            alert("Username is required");
            return;
        }
        if (!user && !formData.password.trim()) {
            alert("Password is required for new users");
            return;
        }
        onSave(formData);
    }

    return (
        <div className="modal-backdrop">
            <div className="modal" style={{ minWidth: 480 }}>
                <button type="button" className="modal-close" onClick={onClose}>
                    ×
                </button>

                <h2 style={{ marginBottom: 16, fontSize: 18 }}>
                    {user ? "Edit User" : "Add New User"}
                </h2>

                <div className="form-grid">
                    <label>
                        <span>Username *</span>
                        <input
                            className="input"
                            value={formData.username}
                            onChange={(e) => handleChange("username", e.target.value)}
                        />
                    </label>

                    <label>
                        <span>Password {user ? "(leave blank to keep current)" : "*"}</span>
                        <input
                            className="input"
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            placeholder={user ? "Leave blank to keep current" : ""}
                        />
                    </label>

                    <label>
                        <span>Name</span>
                        <input
                            className="input"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                    </label>

                    <label>
                        <span>Email</span>
                        <input
                            className="input"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                        />
                    </label>

                    <label>
                        <span>Phone</span>
                        <input
                            className="input"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                        />
                    </label>

                    <label>
                        <span>Role</span>
                        <select
                            className="input"
                            value={formData.role}
                            onChange={(e) => handleChange("role", e.target.value)}
                        >
                            <option value="ADMIN">Administrator</option>
                            <option value="CASHIER">Cashier</option>
                            <option value="OPERATOR">Operator</option>
                            <option value="SPECIAL">Special</option>
                        </select>
                    </label>

                    <label>
                        <span>Branch</span>
                        <input
                            className="input"
                            value={formData.branch}
                            onChange={(e) => handleChange("branch", e.target.value)}
                        />
                    </label>

                    <label>
                        <span>Status</span>
                        <select
                            className="input"
                            value={formData.status}
                            onChange={(e) => handleChange("status", e.target.value)}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </label>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
                    <button
                        type="button"
                        className="button-secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="button-primary"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserForm;
