import React, { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import { ncfAPI } from "../../services/api";

function NCFConfigPage() {
    const [ranges, setRanges] = useState([]);
    const [config, setConfig] = useState({
        email_607_1: "",
        email_607_2: "",
        email_607_3: "",
        selected_period: "",
        auto_apply_itbis: false,
        default_ncf_type: "B02"
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editingRange, setEditingRange] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newRange, setNewRange] = useState({
        series_type: "B02",
        series: "00000",
        prefix: "B02",
        start_number: 1,
        end_number: 1000,
        current_number: 1,
        status: "ACTIVE"
    });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        setError("");
        try {
            const data = await ncfAPI.getRanges();
            setRanges(data.ranges || []);
            if (data.config) {
                setConfig({
                    email_607_1: data.config.email_607_1 || "",
                    email_607_2: data.config.email_607_2 || "",
                    email_607_3: data.config.email_607_3 || "",
                    selected_period: data.config.selected_period || "",
                    auto_apply_itbis: data.config.auto_apply_itbis || false,
                    default_ncf_type: data.config.default_ncf_type || "B02"
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddRange() {
        setLoading(true);
        setError("");
        try {
            await ncfAPI.createRange(newRange);
            await fetchData();
            setShowAddModal(false);
            setSuccess("NCF range created successfully!");
            setTimeout(() => setSuccess(""), 3000);
            // Reset form
            setNewRange({
                series_type: "B02",
                series: "00000",
                prefix: "B02",
                start_number: 1,
                end_number: 1000,
                current_number: 1,
                status: "ACTIVE"
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleConfigChange(field, value) {
        setConfig(prev => ({ ...prev, [field]: value }));
    }

    async function handleSaveConfig() {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await ncfAPI.updateConfig(config);
            setSuccess("Configuration saved successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleEditRange(range) {
        setEditingRange({ ...range });
    }

    function handleRangeChange(field, value) {
        setEditingRange(prev => ({ ...prev, [field]: value }));
    }

    async function handleSaveRange() {
        if (!editingRange) return;

        setLoading(true);
        setError("");
        try {
            await ncfAPI.updateRange(editingRange.id, editingRange);
            await fetchData();
            setEditingRange(null);
            setSuccess("NCF range updated successfully!");
            setTimeout(() => setSuccess(""), 3000);
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
                        <h1 className="customers-title">Tax Receipts (NCF) Configuration</h1>
                    </div>

                    {error && (
                        <div style={{ padding: "12px 20px", background: "#991b1b", color: "#fecaca", marginBottom: "16px", borderRadius: "6px" }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div style={{ padding: "12px 20px", background: "#166534", color: "#bbf7d0", marginBottom: "16px", borderRadius: "6px" }}>
                            {success}
                        </div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", margin: "50px 100px 0px 100px" }}>
                        {/* ✅ NCF Ranges Section with Add Button */}
                        <div style={{ background: "#1e293b", padding: "24px", borderRadius: "8px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                <h2 style={{ fontSize: 16, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 20 }}>📋</span>
                                    NCF Ranges
                                </h2>
                                <button
                                    className="button-primary"
                                    style={{ padding: "6px 12px", fontSize: 13 }}
                                    onClick={() => setShowAddModal(true)}
                                >
                                    + Add Range
                                </button>
                            </div>

                            {loading && ranges.length === 0 ? (
                                <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Loading...</div>
                            ) : (
                                <div className="customers-table-wrapper">
                                    <table className="order-table" style={{ fontSize: 13 }}>
                                        <thead>
                                            <tr>
                                                <th>Status</th>
                                                <th>Series</th>
                                                <th>Type</th>
                                                <th>Prefix</th>
                                                <th>Start</th>
                                                <th>Current</th>
                                                <th>End</th>
                                                <th>Left</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ranges.map((range) => {
                                                const remaining = range.end_number - range.current_number + 1;
                                                const isEditing = editingRange?.id === range.id;
                                                const percentUsed = ((range.current_number - range.start_number) / (range.end_number - range.start_number)) * 100;

                                                return (
                                                    <tr key={range.id} className="order-row">
                                                        <td>
                                                            <span style={{
                                                                padding: "3px 8px",
                                                                borderRadius: "4px",
                                                                fontSize: "11px",
                                                                fontWeight: 500,
                                                                background: range.status === "ACTIVE" ? "#166534" : "#991b1b",
                                                                color: range.status === "ACTIVE" ? "#bbf7d0" : "#fecaca"
                                                            }}>
                                                                {range.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ fontFamily: "monospace", fontWeight: 500 }}>
                                                            {isEditing ? (
                                                                <input
                                                                    type="text"
                                                                    className="input"
                                                                    style={{ width: 70, padding: "4px 8px", fontSize: 12 }}
                                                                    value={editingRange.series}
                                                                    onChange={(e) => handleRangeChange("series", e.target.value)}
                                                                    placeholder="00000"
                                                                />
                                                            ) : range.series}
                                                        </td>
                                                        <td style={{ fontSize: 12, color: "#94a3b8" }}>
                                                            {range.series_type === 'B01' && 'Tax Credit'}
                                                            {range.series_type === 'B02' && 'Consumer'}
                                                            {range.series_type === 'B15' && 'Government'}
                                                        </td>
                                                        <td style={{ fontWeight: 600, color: "#3b82f6" }}>{range.prefix}</td>
                                                        <td>{isEditing ? (
                                                            <input
                                                                type="number"
                                                                className="input"
                                                                style={{ width: 80, padding: "4px 8px", fontSize: 12 }}
                                                                value={editingRange.start_number}
                                                                onChange={(e) => handleRangeChange("start_number", parseInt(e.target.value))}
                                                            />
                                                        ) : range.start_number}</td>
                                                        <td style={{ fontWeight: 500, color: "#10b981" }}>{isEditing ? (
                                                            <input
                                                                type="number"
                                                                className="input"
                                                                style={{ width: 80, padding: "4px 8px", fontSize: 12 }}
                                                                value={editingRange.current_number}
                                                                onChange={(e) => handleRangeChange("current_number", parseInt(e.target.value))}
                                                            />
                                                        ) : range.current_number}</td>
                                                        <td>{isEditing ? (
                                                            <input
                                                                type="number"
                                                                className="input"
                                                                style={{ width: 80, padding: "4px 8px", fontSize: 12 }}
                                                                value={editingRange.end_number}
                                                                onChange={(e) => handleRangeChange("end_number", parseInt(e.target.value))}
                                                            />
                                                        ) : range.end_number}</td>
                                                        <td>
                                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                                <span style={{
                                                                    fontWeight: 500,
                                                                    color: remaining < 100 ? "#ef4444" : remaining < 500 ? "#f59e0b" : "#10b981"
                                                                }}>
                                                                    {remaining}
                                                                </span>
                                                                <div style={{
                                                                    width: 40,
                                                                    height: 4,
                                                                    background: "#0f172a",
                                                                    borderRadius: 2,
                                                                    overflow: "hidden"
                                                                }}>
                                                                    <div style={{
                                                                        width: `${Math.min(percentUsed, 100)}%`,
                                                                        height: "100%",
                                                                        background: percentUsed > 90 ? "#ef4444" : percentUsed > 70 ? "#f59e0b" : "#10b981",
                                                                        transition: "width 0.3s"
                                                                    }} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {isEditing ? (
                                                                <div style={{ display: "flex", gap: "6px" }}>
                                                                    <button
                                                                        className="button-secondary"
                                                                        style={{ padding: "4px 10px", fontSize: "11px" }}
                                                                        onClick={handleSaveRange}
                                                                        disabled={loading}
                                                                    >
                                                                        Save
                                                                    </button>
                                                                    <button
                                                                        className="button-secondary"
                                                                        style={{ padding: "4px 10px", fontSize: "11px" }}
                                                                        onClick={() => setEditingRange(null)}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    className="button-secondary"
                                                                    style={{ padding: "4px 10px", fontSize: "11px" }}
                                                                    onClick={() => handleEditRange(range)}
                                                                >
                                                                    Edit
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* 607 Report Configuration */}
                        <div style={{ background: "#1e293b", padding: "24px", borderRadius: "8px", height: "fit-content" }}>
                            <h2 style={{ fontSize: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 20 }}>⚙️</span>
                                607 Report Configuration
                            </h2>

                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <label>
                                    <span style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#94a3b8" }}>Email 1</span>
                                    <input
                                        className="input"
                                        type="email"
                                        value={config.email_607_1}
                                        onChange={(e) => handleConfigChange("email_607_1", e.target.value)}
                                        placeholder="email@example.com"
                                    />
                                </label>

                                <label>
                                    <span style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#94a3b8" }}>Email 2</span>
                                    <input
                                        className="input"
                                        type="email"
                                        value={config.email_607_2}
                                        onChange={(e) => handleConfigChange("email_607_2", e.target.value)}
                                        placeholder="email@example.com"
                                    />
                                </label>

                                <label>
                                    <span style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#94a3b8" }}>Email 3</span>
                                    <input
                                        className="input"
                                        type="email"
                                        value={config.email_607_3}
                                        onChange={(e) => handleConfigChange("email_607_3", e.target.value)}
                                        placeholder="email@example.com"
                                    />
                                </label>

                                <label>
                                    <span style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#94a3b8" }}>Selected Period</span>
                                    <input
                                        className="input"
                                        value={config.selected_period}
                                        onChange={(e) => handleConfigChange("selected_period", e.target.value)}
                                        placeholder="2026/01"
                                    />
                                </label>

                                <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px", background: "#0f172a", borderRadius: "6px", cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        checked={config.auto_apply_itbis}
                                        onChange={(e) => handleConfigChange("auto_apply_itbis", e.target.checked)}
                                        style={{ width: 18, height: 18, cursor: "pointer" }}
                                    />
                                    <span style={{ fontSize: 13 }}>Auto-apply ITBIS (tax) on orders</span>
                                </label>

                                <label>
                                    <span style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#94a3b8" }}>Default NCF Type</span>
                                    <select
                                        className="input"
                                        value={config.default_ncf_type}
                                        onChange={(e) => handleConfigChange("default_ncf_type", e.target.value)}
                                    >
                                        <option value="B01">B01 - Tax Credit</option>
                                        <option value="B02">B02 - Consumer Final</option>
                                        <option value="B15">B15 - Governmental</option>
                                    </select>
                                </label>

                                <button
                                    type="button"
                                    className="button-primary"
                                    onClick={handleSaveConfig}
                                    disabled={loading}
                                    style={{ marginTop: 8, width: "100%" }}
                                >
                                    {loading ? "Saving..." : "Save Configuration"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ✅ Add Range Modal */}
                    {showAddModal && (
                        <div style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(0,0,0,0.7)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1000
                        }}>
                            <div style={{
                                background: "#1e293b",
                                padding: "24px",
                                borderRadius: "8px",
                                width: "90%",
                                maxWidth: "500px"
                            }}>
                                <h2 style={{ fontSize: 18, marginBottom: 20 }}>Add New NCF Range</h2>

                                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                    <label>
                                        <span style={{ display: "block", marginBottom: 6, fontSize: 13 }}>Type</span>
                                        <select
                                            className="input"
                                            value={newRange.series_type}
                                            onChange={(e) => {
                                                const type = e.target.value;
                                                setNewRange(prev => ({
                                                    ...prev,
                                                    series_type: type,
                                                    prefix: type
                                                }));
                                            }}
                                        >
                                            <option value="B01">B01 - Tax Credit</option>
                                            <option value="B02">B02 - Consumer Final</option>
                                            <option value="B15">B15 - Governmental</option>
                                        </select>
                                    </label>

                                    <label>
                                        <span style={{ display: "block", marginBottom: 6, fontSize: 13 }}>Series</span>
                                        <input
                                            className="input"
                                            value={newRange.series}
                                            onChange={(e) => setNewRange(prev => ({ ...prev, series: e.target.value }))}
                                            placeholder="00000"
                                        />
                                    </label>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                        <label>
                                            <span style={{ display: "block", marginBottom: 6, fontSize: 13 }}>Start Number</span>
                                            <input
                                                className="input"
                                                type="number"
                                                value={newRange.start_number}
                                                onChange={(e) => setNewRange(prev => ({
                                                    ...prev,
                                                    start_number: parseInt(e.target.value),
                                                    current_number: parseInt(e.target.value)
                                                }))}
                                            />
                                        </label>

                                        <label>
                                            <span style={{ display: "block", marginBottom: 6, fontSize: 13 }}>End Number</span>
                                            <input
                                                className="input"
                                                type="number"
                                                value={newRange.end_number}
                                                onChange={(e) => setNewRange(prev => ({ ...prev, end_number: parseInt(e.target.value) }))}
                                            />
                                        </label>
                                    </div>

                                    <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                                        <button
                                            className="button-primary"
                                            onClick={handleAddRange}
                                            disabled={loading}
                                            style={{ flex: 1 }}
                                        >
                                            {loading ? "Creating..." : "Create Range"}
                                        </button>
                                        <button
                                            className="button-secondary"
                                            onClick={() => setShowAddModal(false)}
                                            style={{ flex: 1 }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default NCFConfigPage;
