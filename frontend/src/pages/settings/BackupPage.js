import React, { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import { backupAPI } from "../../services/api";

function BackupPage() {
    const [config, setConfig] = useState({
        backup_location: "D:\\Esoft\\Backup\\Base_Datos",
        last_backup_date: null,
        next_backup_date: null,
        backup_cycle_days: 5,
        auto_backup_enabled: true
    });
    const [loading, setLoading] = useState(false);
    const [triggering, setTriggering] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchConfig();
    }, []);

    async function fetchConfig() {
        setLoading(true);
        setError("");
        try {
            const data = await backupAPI.get();
            if (data.config) {
                setConfig({
                    backup_location: data.config.backup_location || "D:\\Esoft\\Backup\\Base_Datos",
                    last_backup_date: data.config.last_backup_date,
                    next_backup_date: data.config.next_backup_date,
                    backup_cycle_days: data.config.backup_cycle_days || 5,
                    auto_backup_enabled: data.config.auto_backup_enabled !== undefined ? data.config.auto_backup_enabled : true
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function formatDate(dateString) {
        if (!dateString) return "Never";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function handleChange(field, value) {
        setConfig(prev => ({ ...prev, [field]: value }));
    }

    async function handleSave() {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await backupAPI.update(config);
            setSuccess("Backup settings saved successfully!");
            setTimeout(() => setSuccess(""), 3000);
            await fetchConfig();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleBackupNow() {
        if (!window.confirm("Create a backup now?")) {
            return;
        }

        setTriggering(true);
        setError("");
        setSuccess("");
        try {
            const data = await backupAPI.trigger();
            setSuccess(`Backup created successfully! Next backup: ${formatDate(data.nextBackup)}`);
            setTimeout(() => setSuccess(""), 5000);
            await fetchConfig();
        } catch (err) {
            setError(err.message);
        } finally {
            setTriggering(false);
        }
    }

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="dashboard-main">
                <Header />
                <div>
                    <div className="customers-header-bar">
                        <h1 className="customers-title">Backup Configuration</h1>
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

                    {loading && !config.backup_location ? (
                        <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>Loading...</div>
                    ) : (
                        <div style={{
                            margin: "100px",
                            display: "grid",
                            gridTemplateColumns: "420px 1fr",
                            gap: "48px",
                            alignItems: "start",
                        }}>
                            <div style={{
                                background: "#1e293b",
                                padding: "28px",
                                borderRadius: "8px"
                            }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                                    <div style={{
                                        background: "#0f172a",
                                        padding: "22px",
                                        borderRadius: "8px",
                                        border: "1px solid #334155",
                                        minHeight: "90px"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                                            <div style={{
                                                width: 40,
                                                height: 40,
                                                background: "#3b82f6",
                                                borderRadius: "6px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 20
                                            }}>
                                                📅
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Last Backup</p>
                                                <p style={{ fontSize: 16, fontWeight: 600 }}>
                                                    {formatDate(config.last_backup_date)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        background: "#0f172a",
                                        padding: "22px",
                                        borderRadius: "8px",
                                        border: "1px solid #334155",
                                        minHeight: "90px"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                                            <div style={{
                                                width: 40,
                                                height: 40,
                                                background: "#10b981",
                                                borderRadius: "6px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 20
                                            }}>
                                                ⏰
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Next Backup</p>
                                                <p style={{ fontSize: 16, fontWeight: 600 }}>
                                                    {formatDate(config.next_backup_date)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        background: "#0f172a",
                                        padding: "22px",
                                        borderRadius: "8px",
                                        border: "1px solid #334155",
                                        minHeight: "90px"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                                            <div style={{
                                                width: 40,
                                                height: 40,
                                                background: "#f59e0b",
                                                borderRadius: "6px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 20
                                            }}>
                                                🔄
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Backup Cycle</p>
                                                <p style={{ fontSize: 16, fontWeight: 600 }}>
                                                    Every {config.backup_cycle_days} days
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                background: "#1e293b",
                                padding: "28px",
                                borderRadius: "8px",
                                minHeight: "fit-content"
                            }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                    <label>
                                        <span style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Backup Location</span>
                                        <input
                                            className="input"
                                            value={config.backup_location}
                                            onChange={(e) => handleChange("backup_location", e.target.value)}
                                            placeholder="D:\Esoft\Backup\Base_Datos"
                                        />
                                        <p style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
                                            Full path where backup files will be stored
                                        </p>
                                    </label>

                                    <label>
                                        <span style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Backup Cycle (Days)</span>
                                        <input
                                            className="input"
                                            type="number"
                                            min="1"
                                            max="30"
                                            value={config.backup_cycle_days}
                                            onChange={(e) => handleChange("backup_cycle_days", parseInt(e.target.value) || 5)}
                                            style={{ maxWidth: 200 }}
                                        />
                                        <p style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
                                            How often automatic backups should run
                                        </p>
                                    </label>

                                    <label style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px", background: "#0f172a", borderRadius: "8px", cursor: "pointer" }}>
                                        <input
                                            type="checkbox"
                                            checked={config.auto_backup_enabled}
                                            onChange={(e) => handleChange("auto_backup_enabled", e.target.checked)}
                                            style={{ width: 20, height: 20, cursor: "pointer" }}
                                        />
                                        <div>
                                            <span style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Enable automatic backup</span>
                                            <span style={{ fontSize: 12, color: "#64748b" }}>Automatically create backups based on the cycle</span>
                                        </div>
                                    </label>

                                    <div style={{ display: "flex", gap: 12, marginTop: 12, paddingTop: 20, borderTop: "1px solid #334155" }}>
                                        <button
                                            type="button"
                                            className="button-secondary"
                                            onClick={handleBackupNow}
                                            disabled={loading || triggering}
                                            style={{
                                                background: "#3b82f6",
                                                borderColor: "#3b82f6",
                                                color: "#fff",
                                                flex: 1
                                            }}
                                        >
                                            {triggering ? "Creating Backup..." : "🔄 Backup Now"}
                                        </button>
                                        <button
                                            type="button"
                                            className="button-primary"
                                            onClick={handleSave}
                                            disabled={loading || triggering}
                                            style={{ flex: 1 }}
                                        >
                                            {loading ? "Saving..." : "💾 Save Settings"}
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

export default BackupPage;
