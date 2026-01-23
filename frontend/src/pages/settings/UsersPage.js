import React, { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import UserForm from "../../components/settings/UserForm";
import { usersAPI } from "../../services/api";

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setLoading(true);
        setError("");
        try {
            const data = await usersAPI.getAll();
            setUsers(data.users);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleAddNew() {
        setEditingUser(null);
        setModalOpen(true);
    }

    function handleEdit(user) {
        setEditingUser(user);
        setModalOpen(true);
    }

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }

        setLoading(true);
        setError("");
        try {
            await usersAPI.delete(id);
            await fetchUsers();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(userData) {
        setLoading(true);
        setError("");
        try {
            if (editingUser) {
                await usersAPI.update(editingUser.id, userData);
            } else {
                await usersAPI.create(userData);
            }
            await fetchUsers();
            setModalOpen(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="dashboard-main">
                <Header />
                <div>
                    <div className="customers-header-bar">
                        <h1 className="customers-title">Users Management</h1>
                        <button className="customers-action-button" onClick={handleAddNew}>
                            Add New User
                        </button>
                    </div>

                    {error && (
                        <div style={{ padding: "12px 20px", background: "#991b1b", color: "#fecaca", marginBottom: "16px" }}>
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div style={{ padding: 20, textAlign: "center" }}>Loading...</div>
                    ) : (
                        <div className="customers-table-wrapper">
                            <table className="order-table customers-table">
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Role</th>
                                        <th>Branch</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="order-row">
                                            <td style={{ fontWeight: 500 }}>{user.username}</td>
                                            <td>{user.name || "-"}</td>
                                            <td>{user.email || "-"}</td>
                                            <td>{user.phone || "-"}</td>
                                            <td>{user.role}</td>
                                            <td>{user.branch}</td>
                                            <td>
                                                <span style={{
                                                    padding: "2px 8px",
                                                    borderRadius: "4px",
                                                    fontSize: "12px",
                                                    background: user.status === "ACTIVE" ? "#166534" : "#991b1b",
                                                    color: user.status === "ACTIVE" ? "#bbf7d0" : "#fecaca"
                                                }}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                    <button
                                                        className="button-secondary"
                                                        style={{ padding: "4px 12px", fontSize: "12px" }}
                                                        onClick={() => handleEdit(user)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="button-secondary"
                                                        style={{
                                                            padding: "4px 12px",
                                                            fontSize: "12px",
                                                            borderColor: "#ef4444",
                                                            color: "#ef4444"
                                                        }}
                                                        onClick={() => handleDelete(user.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={8} style={{ textAlign: "center", padding: 16 }}>
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {modalOpen && (
                        <UserForm
                            user={editingUser}
                            onSave={handleSave}
                            onClose={() => setModalOpen(false)}
                            loading={loading}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

export default UsersPage;
