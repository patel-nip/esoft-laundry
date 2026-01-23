import React, { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import { printersAPI } from "../../services/api";

function PrintersPage() {
    const [settings, setSettings] = useState({
        invoice_printer: "Microsoft Print to PDF",
        invoice_paper_type: "Thermal Paper",
        report_printer: "Microsoft Print to PDF",
        report_paper_type: "Thermal Paper"
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        setLoading(true);
        setError("");
        try {
            const data = await printersAPI.get();
            if (data.settings) {
                setSettings({
                    invoice_printer: data.settings.invoice_printer || "Microsoft Print to PDF",
                    invoice_paper_type: data.settings.invoice_paper_type || "Thermal Paper",
                    report_printer: data.settings.report_printer || "Microsoft Print to PDF",
                    report_paper_type: data.settings.report_paper_type || "Thermal Paper"
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(field, value) {
        setSettings(prev => ({ ...prev, [field]: value }));
    }

    async function handleSave() {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await printersAPI.update(settings);
            setSuccess("Printer settings saved successfully!");
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
                        <h1 className="customers-title">Printer Configuration</h1>
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

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "24px",
                        maxWidth: "1400px",
                        margin: "100px"
                    }}>

                        <div style={{ background: "#1e293b", padding: "24px", borderRadius: "8px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    background: "#3b82f6",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "24px"
                                }}>
                                    📄
                                </div>
                                <div>
                                    <h2 style={{ fontSize: 16, marginBottom: 4 }}>Printer for Invoices</h2>
                                    <p style={{ fontSize: 13, color: "#94a3b8" }}>Configure printer and paper type for invoice printing</p>
                                </div>
                            </div>

                            <div className="form-grid">
                                <label>
                                    <span>Select Printer</span>
                                    <select
                                        className="input"
                                        value={settings.invoice_printer}
                                        onChange={(e) => handleChange("invoice_printer", e.target.value)}
                                    >
                                        <option value="Microsoft Print to PDF">Microsoft Print to PDF</option>
                                        <option value="Default Printer">Default Printer</option>
                                        <option value="Thermal Printer">Thermal Printer</option>
                                        <option value="Network Printer">Network Printer</option>
                                    </select>
                                </label>

                                <label>
                                    <span>Paper Type</span>
                                    <select
                                        className="input"
                                        value={settings.invoice_paper_type}
                                        onChange={(e) => handleChange("invoice_paper_type", e.target.value)}
                                    >
                                        <option value="Thermal Paper">Thermal Paper</option>
                                        <option value="A4">A4</option>
                                        <option value="Letter">Letter</option>
                                        <option value="Receipt Paper">Receipt Paper</option>
                                    </select>
                                </label>
                            </div>

                            <div style={{ marginTop: 12, padding: "12px", background: "#0f172a", borderRadius: "6px" }}>
                                <p style={{ fontSize: 12, color: "#94a3b8" }}>
                                    <strong>Current:</strong> {settings.invoice_printer} - {settings.invoice_paper_type}
                                </p>
                            </div>
                        </div>

                        <div style={{ background: "#1e293b", padding: "24px", borderRadius: "8px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    background: "#10b981",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "24px"
                                }}>
                                    📊
                                </div>
                                <div>
                                    <h2 style={{ fontSize: 16, marginBottom: 4 }}>Printer for Reports & Documents</h2>
                                    <p style={{ fontSize: 13, color: "#94a3b8" }}>Configure printer and paper type for report printing</p>
                                </div>
                            </div>

                            <div className="form-grid">
                                <label>
                                    <span>Select Printer</span>
                                    <select
                                        className="input"
                                        value={settings.report_printer}
                                        onChange={(e) => handleChange("report_printer", e.target.value)}
                                    >
                                        <option value="Microsoft Print to PDF">Microsoft Print to PDF</option>
                                        <option value="Default Printer">Default Printer</option>
                                        <option value="Thermal Printer">Thermal Printer</option>
                                        <option value="Network Printer">Network Printer</option>
                                    </select>
                                </label>

                                <label>
                                    <span>Paper Type</span>
                                    <select
                                        className="input"
                                        value={settings.report_paper_type}
                                        onChange={(e) => handleChange("report_paper_type", e.target.value)}
                                    >
                                        <option value="Thermal Paper">Thermal Paper</option>
                                        <option value="A4">A4</option>
                                        <option value="Letter">Letter</option>
                                        <option value="Receipt Paper">Receipt Paper</option>
                                    </select>
                                </label>
                            </div>

                            <div style={{ marginTop: 12, padding: "12px", background: "#0f172a", borderRadius: "6px" }}>
                                <p style={{ fontSize: 12, color: "#94a3b8" }}>
                                    <strong>Current:</strong> {settings.report_printer} - {settings.report_paper_type}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
                        <button
                            type="button"
                            style={{
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "none",
                                background: "#0ea5e9",
                                color: "white",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: "pointer",
                                margin: "0px 100px 0px 0px"
                            }}
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </main >
        </div >
    );
}

export default PrintersPage;
