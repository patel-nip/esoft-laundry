import React from "react";

function InvoiceMessageForm({ settings, onChange, onSave, loading }) {
    return (
        <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>
                        Final Note for Invoices
                    </label>
                    <textarea
                        className="input"
                        rows={4}
                        value={settings.footer_message}
                        onChange={(e) => onChange("footer_message", e.target.value)}
                        placeholder="Thank you for your business!"
                        style={{ resize: "vertical", fontFamily: "inherit" }}
                    />
                    <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                        This message will appear at the bottom of printed invoices.
                    </p>
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>
                        Invoice Phrase / Terms
                    </label>
                    <textarea
                        className="input"
                        rows={4}
                        value={settings.terms_and_conditions}
                        onChange={(e) => onChange("terms_and_conditions", e.target.value)}
                        placeholder="All items must be claimed within 30 days."
                        style={{ resize: "vertical", fontFamily: "inherit" }}
                    />
                    <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                        Additional terms or conditions for invoices.
                    </p>
                </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 24, justifyContent: "flex-end" }}>
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

export default InvoiceMessageForm;
