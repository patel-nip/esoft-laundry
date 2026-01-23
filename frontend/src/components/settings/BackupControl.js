import React from "react";

function BackupControl({ config, onChange, onSave, onBackupNow, loading, triggering }) {
    return (
        <div>
            <div style={{ background: "#0f172a", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                    <div>
                        <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Last Backup</p>
                        <p style={{ fontSize: 18, fontWeight: 500 }}>
                            {config.last_backup_date || "Never"}
                        </p>
                    </div>
                    <div>
                        <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Next Backup</p>
                        <p style={{ fontSize: 18, fontWeight: 500 }}>
                            {config.next_backup_date || "Not scheduled"}
                        </p>
                    </div>
                    <div>
                        <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Backup Cycle</p>
                        <p style={{ fontSize: 18, fontWeight: 500 }}>
                            Every {config.backup_cycle_days} days
                        </p>
                    </div>
                </div>
            </div>

            <div className="form-grid">
                <label style={{ gridColumn: "1 / -1" }}>
                    <span>Backup Location</span>
                    <input
                        className="input"
                        value={config.backup_location}
                        onChange={(e) => onChange("backup_location", e.target.value)}
                        placeholder="D:\Esoft\Backup\Base_Datos"
                    />
                </label>

                <label>
                    <span>Backup Cycle (Days)</span>
                    <input
                        className="input"
                        type="number"
                        min="1"
                        value={config.backup_cycle_days}
                        onChange={(e) => onChange("backup_cycle_days", parseInt(e.target.value) || 5)}
                    />
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 8, gridColumn: "1 / -1" }}>
                    <input
                        type="checkbox"
                        checked={config.auto_backup_enabled}
                        onChange={(e) => onChange("auto_backup_enabled", e.target.checked)}
                        style={{ width: 18, height: 18 }}
                    />
                    <span>Enable automatic backup</span>
                </label>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "space-between" }}>
                <button
                    type="button"
                    className="button-secondary"
                    onClick={onBackupNow}
                    disabled={loading || triggering}
                    style={{
                        background: "#3b82f6",
                        borderColor: "#3b82f6",
                        color: "#fff"
                    }}
                >
                    {triggering ? "Creating Backup..." : "Backup Now"}
                </button>
                <button
                    type="button"
                    className="button-primary"
                    onClick={onSave}
                    disabled={loading || triggering}
                >
                    {loading ? "Saving..." : "Save Settings"}
                </button>
            </div>
        </div>
    );
}

export default BackupControl;
