import React from "react";

function CompanyForm({ company, onChange, onSave, loading }) {
    return (
        <div>
            <div className="form-grid">
                <label>
                    <span>Company Name *</span>
                    <input
                        className="input"
                        value={company.company_name}
                        onChange={(e) => onChange("company_name", e.target.value)}
                    />
                </label>

                <label>
                    <span>Slogan</span>
                    <input
                        className="input"
                        value={company.slogan}
                        onChange={(e) => onChange("slogan", e.target.value)}
                    />
                </label>

                <label>
                    <span>Address</span>
                    <input
                        className="input"
                        value={company.address}
                        onChange={(e) => onChange("address", e.target.value)}
                    />
                </label>

                <label>
                    <span>Phone</span>
                    <input
                        className="input"
                        value={company.phone}
                        onChange={(e) => onChange("phone", e.target.value)}
                    />
                </label>

                <label>
                    <span>Phone 2</span>
                    <input
                        className="input"
                        value={company.phone2}
                        onChange={(e) => onChange("phone2", e.target.value)}
                    />
                </label>

                <label>
                    <span>Email</span>
                    <input
                        className="input"
                        type="email"
                        value={company.email}
                        onChange={(e) => onChange("email", e.target.value)}
                    />
                </label>

                <label>
                    <span>Website</span>
                    <input
                        className="input"
                        value={company.website}
                        onChange={(e) => onChange("website", e.target.value)}
                    />
                </label>

                <label>
                    <span>Tax ID (RNC)</span>
                    <input
                        className="input"
                        value={company.rnc}
                        onChange={(e) => onChange("rnc", e.target.value)}
                    />
                </label>

                <label style={{ gridColumn: "1 / -1" }}>
                    <span>Schedule</span>
                    <input
                        className="input"
                        value={company.schedule}
                        onChange={(e) => onChange("schedule", e.target.value)}
                        placeholder="Mon-Sat: 8:00 AM - 6:00 PM"
                    />
                </label>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
                <button
                    type="button"
                    className="button-primary"
                    onClick={onSave}
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}

export default CompanyForm;
