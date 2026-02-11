import React, { useState, useEffect } from "react";

const CATEGORY_OPTIONS = ["Clothing", "Home", "Accessories", "Other"];

function ServicePriceModal({ price, onSave, onClose, loading }) {
    const [formData, setFormData] = useState({
        garment_name: "",
        category: "Clothing",
        image_url: "",
        wash_iron: 0,
        wash_iron_white: 0,
        iron_only: 0,
        alterations: 0,
        express_percentage: 20,
    });

    useEffect(() => {
        if (price) {
            setFormData({
                garment_name: price.garment_name || "",
                category: price.category || "Clothing",
                image_url: price.image_url || "",
                wash_iron: Number(price.wash_iron) || 0,
                wash_iron_white: Number(price.wash_iron_white) || 0,
                iron_only: Number(price.iron_only) || 0,
                alterations: Number(price.alterations) || 0,
                express_percentage: Number(price.express_percentage) || 20,
            });
        } else {
            setFormData({
                garment_name: "",
                category: "Clothing",
                image_url: "",
                wash_iron: 0,
                wash_iron_white: 0,
                iron_only: 0,
                alterations: 0,
                express_percentage: 20,
            });
        }
    }, [price]);

    function handleChange(field, value) {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }

    function handleSubmit() {
        if (!formData.garment_name.trim()) {
            alert("Garment name is required");
            return;
        }

        // send clean values
        onSave({
            ...formData,
            garment_name: formData.garment_name.trim(),
            category: formData.category || null,
            image_url: formData.image_url?.trim() ? formData.image_url.trim() : null,
        });
    }

    return (
        <div className="modal-backdrop">
            <div className="modal" style={{ minWidth: 520 }}>
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
                        <span>Category</span>
                        <select
                            className="input"
                            value={formData.category}
                            onChange={(e) => handleChange("category", e.target.value)}
                        >
                            {CATEGORY_OPTIONS.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label style={{ gridColumn: "1 / -1" }}>
                        <span>Image URL (optional)</span>
                        <input
                            className="input"
                            value={formData.image_url}
                            onChange={(e) => handleChange("image_url", e.target.value)}
                            placeholder="https://...jpg/png/webp"
                        />
                    </label>

                    {formData.image_url?.trim() && (
                        <div style={{ gridColumn: "1 / -1" }}>
                            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>
                                Preview
                            </div>
                            <img
                                src={formData.image_url}
                                alt="preview"
                                style={{
                                    width: 120,
                                    height: 90,
                                    objectFit: "cover",
                                    borderRadius: 10,
                                    border: "1px solid #374151",
                                }}
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>
                                Tip: use a square-ish image for best fit in Create Order.
                            </div>
                        </div>
                    )}

                    <label>
                        <span>Wash & Iron</span>
                        <input
                            className="input"
                            type="number"
                            step="0.01"
                            value={formData.wash_iron}
                            onChange={(e) =>
                                handleChange("wash_iron", parseFloat(e.target.value) || 0)
                            }
                        />
                    </label>

                    <label>
                        <span>Wash & Iron White</span>
                        <input
                            className="input"
                            type="number"
                            step="0.01"
                            value={formData.wash_iron_white}
                            onChange={(e) =>
                                handleChange("wash_iron_white", parseFloat(e.target.value) || 0)
                            }
                        />
                    </label>

                    <label>
                        <span>Iron Only</span>
                        <input
                            className="input"
                            type="number"
                            step="0.01"
                            value={formData.iron_only}
                            onChange={(e) =>
                                handleChange("iron_only", parseFloat(e.target.value) || 0)
                            }
                        />
                    </label>

                    <label>
                        <span>Alterations</span>
                        <input
                            className="input"
                            type="number"
                            step="0.01"
                            value={formData.alterations}
                            onChange={(e) =>
                                handleChange("alterations", parseFloat(e.target.value) || 0)
                            }
                        />
                    </label>

                    <label>
                        <span>Express Percentage (%)</span>
                        <input
                            className="input"
                            type="number"
                            step="0.01"
                            value={formData.express_percentage}
                            onChange={(e) =>
                                handleChange(
                                    "express_percentage",
                                    parseFloat(e.target.value) || 0
                                )
                            }
                        />
                    </label>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 16,
                        justifyContent: "flex-end",
                    }}
                >
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
