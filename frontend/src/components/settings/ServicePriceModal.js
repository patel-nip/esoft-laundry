import React, { useState, useEffect } from "react";

function ServicePriceModal({ price, onSave, onClose, loading }) {
    const [formData, setFormData] = useState({
        garment_name: "",
        wash_iron: 0,
        wash_iron_white: 0,
        iron_only: 0,
        alterations: 0,
        express_percentage: 20
    });

    useEffect(() => {
        if (price) {
            setFormData({
                garment_name: price.garment_name,
                wash_iron: price.wash_iron,
                wash_iron_white: price.wash_iron_white,
                iron_only: price.iron_only,
                alterations: price.alterations,
                express_percentage: price.express_percentage
            });
        }
    }, [price]);

    function handleChange(field, value) {
        setFormData(prev => ({ ...prev, [field]: value }));
    }

    function handleSubmit() {
        if (!formData.garment_name.trim()) {
            alert("Garment name is required");
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
                    {price ? "Edit Service Price" : "Add New Service Price"}
                </h2>

                <div className="form-grid">
                    <label>
                        <span>Garment Name *</span>
                        <input
                            className="input"
                            value={formData.garment_name}
                            onChange={(e) => handleChange("garment_name", e.target.value)}
                        />
                    </label>

                    <label>
                        <span>Wash & Iron</span>
                        <input
                            className="input"
                            type="number"
                            step="0.01"
                            value={formData.wash_iron}
                            onChange={(e) => handleChange("wash_iron", parseFloat(e.target.value) || 0)}
                        />
                    </label>

                    <label>
                        <span>Wash & Iron White</span>
                        <input
                            className="input"
                            type="number"
                            step="0.01"
                            value={formData.wash_iron_white}
                            onChange={(e) => handleChange("wash_iron_white", parseFloat(e.target.value) || 0)}
                        />
                    </label>

                    <label>
                        <span>Iron Only</span>
                        <input
                            className="input"
                            type="number"
                            step="0.01"
                            value={formData.iron_only}
                            onChange={(e) => handleChange("iron_only", parseFloat(e.target.value) || 0)}
                        />
                    </label>

                    <label>
                        <span>Alterations</span>
                        <input
                            className="input"
                            type="number"
                            step="0.01"
                            value={formData.alterations}
                            onChange={(e) => handleChange("alterations", parseFloat(e.target.value) || 0)}
                        />
                    </label>

                    <label>
                        <span>Express Percentage (%)</span>
                        <input
                            className="input"
                            type="number"
                            step="0.01"
                            value={formData.express_percentage}
                            onChange={(e) => handleChange("express_percentage", parseFloat(e.target.value) || 0)}
                        />
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

export default ServicePriceModal;
