import React, { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import { companyAPI } from "../../services/api";

function CompanyInfoPage() {
    const [company, setCompany] = useState({
        company_name: "",
        slogan: "",
        address: "",
        phone: "",
        phone2: "",
        email: "",
        website: "",
        rnc: "",
        schedule: "",
        logo_url: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchCompany();
    }, []);

    async function fetchCompany() {
        setLoading(true);
        setError("");
        try {
            const data = await companyAPI.get();
            if (data.company) {
                setCompany({
                    company_name: data.company.company_name || "",
                    slogan: data.company.slogan || "",
                    address: data.company.address || "",
                    phone: data.company.phone || "",
                    phone2: data.company.phone2 || "",
                    email: data.company.email || "",
                    website: data.company.website || "",
                    rnc: data.company.rnc || "",
                    schedule: data.company.schedule || "",
                    logo_url: data.company.logo_url || ""
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(field, value) {
        setCompany(prev => ({ ...prev, [field]: value }));
    }

    async function handleSave() {
        if (!company.company_name.trim()) {
            alert("Company name is required");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await companyAPI.update(company);
            setSuccess("Company information saved successfully!");
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
                        <h1 className="customers-title">Company Information</h1>
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

                    <div style={{ maxWidth: 900, margin: "90px auto" }}>
                        <div style={{ background: "#1e293b", padding: "28px", borderRadius: "8px",}}>
                            {loading && !company.company_name ? (
                                <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Loading...</div>
                            ) : (
                                <div>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginBottom: "20px" }}>
                                        <label>
                                            <span style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
                                                Company Name *
                                            </span>
                                            <input
                                                className="input"
                                                value={company.company_name}
                                                onChange={(e) => handleChange("company_name", e.target.value)}
                                            />
                                        </label>

                                        <label>
                                            <span style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
                                                Slogan
                                            </span>
                                            <input
                                                className="input"
                                                value={company.slogan}
                                                onChange={(e) => handleChange("slogan", e.target.value)}
                                                placeholder="Quality and Punctuality"
                                            />
                                        </label>
                                    </div>

                                    <div style={{ marginBottom: "20px" }}>
                                        <label>
                                            <span style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
                                                Address
                                            </span>
                                            <input
                                                className="input"
                                                value={company.address}
                                                onChange={(e) => handleChange("address", e.target.value)}
                                                placeholder="123 Main Street, City, State"
                                            />
                                        </label>
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginBottom: "20px" }}>
                                        <label>
                                            <span style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
                                                Phone
                                            </span>
                                            <input
                                                className="input"
                                                value={company.phone}
                                                onChange={(e) => handleChange("phone", e.target.value)}
                                                placeholder="(123) 456-7890"
                                            />
                                        </label>

                                        <label>
                                            <span style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
                                                Phone 2 (Optional)
                                            </span>
                                            <input
                                                className="input"
                                                value={company.phone2}
                                                onChange={(e) => handleChange("phone2", e.target.value)}
                                                placeholder="(123) 456-7891"
                                            />
                                        </label>
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginBottom: "20px" }}>
                                        <label>
                                            <span style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
                                                Email
                                            </span>
                                            <input
                                                className="input"
                                                type="email"
                                                value={company.email}
                                                onChange={(e) => handleChange("email", e.target.value)}
                                                placeholder="info@company.com"
                                            />
                                        </label>

                                        <label>
                                            <span style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
                                                Website
                                            </span>
                                            <input
                                                className="input"
                                                value={company.website}
                                                onChange={(e) => handleChange("website", e.target.value)}
                                                placeholder="www.company.com"
                                            />
                                        </label>
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px", marginBottom: "20px" }}>
                                        <label>
                                            <span style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
                                                Tax ID (RNC)
                                            </span>
                                            <input
                                                className="input"
                                                value={company.rnc}
                                                onChange={(e) => handleChange("rnc", e.target.value)}
                                                placeholder="1111111"
                                            />
                                        </label>

                                        <label>
                                            <span style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
                                                Schedule
                                            </span>
                                            <input
                                                className="input"
                                                value={company.schedule}
                                                onChange={(e) => handleChange("schedule", e.target.value)}
                                                placeholder="Mon-Sat: 8:00 AM - 6:00 PM"
                                            />
                                        </label>
                                    </div>

                                    <div style={{ display: "flex", gap: 12, marginTop: 24, paddingTop: 20, borderTop: "1px solid #334155" }}>
                                        <button
                                            type="button"
                                            className="button-primary"
                                            onClick={handleSave}
                                            disabled={loading}
                                            style={{ marginLeft: "auto", minWidth: 150 }}
                                        >
                                            {loading ? "Saving..." : "💾 Save Changes"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CompanyInfoPage;
