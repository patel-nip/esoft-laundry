import React, { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import InvoiceMessageForm from "../../components/settings/InvoiceMessageForm";
import { invoiceSettingsAPI } from "../../services/api";

function InvoiceMessagePage() {
    const [settings, setSettings] = useState({
        footer_message: "",
        terms_and_conditions: ""
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
            const data = await invoiceSettingsAPI.get();
            if (data.settings) {
                setSettings({
                    footer_message: data.settings.footer_message || "",
                    terms_and_conditions: data.settings.terms_and_conditions || ""
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
            await invoiceSettingsAPI.update(settings);
            setSuccess("Invoice message settings saved successfully!");
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
                        <h1 className="customers-title">Invoice Message Settings</h1>
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

                    <div style={{ background: "#1e293b", padding: "24px", borderRadius: "8px", maxWidth: "800px", margin:"100px auto"}}>
                        {loading && !settings.footer_message && !settings.terms_and_conditions ? (
                            <div style={{ padding: 20, textAlign: "center" }}>Loading...</div>
                        ) : (
                            <InvoiceMessageForm
                                settings={settings}
                                onChange={handleChange}
                                onSave={handleSave}
                                loading={loading}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default InvoiceMessagePage;
