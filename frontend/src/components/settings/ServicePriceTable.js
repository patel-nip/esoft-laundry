import React from "react";

function ServicePriceTable({ servicePrices, onEdit, onDelete }) {
    return (
        <div className="customers-table-wrapper">
            <table className="order-table customers-table">
                <thead>
                    <tr>
                        <th>Garment</th>
                        <th>Wash & Iron</th>
                        <th>Wash & Iron White</th>
                        <th>Iron Only</th>
                        <th>Alterations</th>
                        <th>Express %</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {servicePrices.map((price) => (
                        <tr key={price.id} className="order-row">
                            <td style={{ fontWeight: 500 }}>{price.garment_name}</td>
                            <td>{price.wash_iron}</td>
                            <td>{price.wash_iron_white}</td>
                            <td>{price.iron_only}</td>
                            <td>{price.alterations}</td>
                            <td>{price.express_percentage}%</td>
                            <td>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <button
                                        className="button-secondary"
                                        style={{ padding: "4px 12px", fontSize: "12px" }}
                                        onClick={() => onEdit(price)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="button-secondary"
                                        style={{
                                            padding: "4px 12px",
                                            fontSize: "12px",
                                            borderColor: "#ef4444",
                                            color: "#ef4444"
                                        }}
                                        onClick={() => onDelete(price.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {servicePrices.length === 0 && (
                        <tr>
                            <td colSpan={7} style={{ textAlign: "center", padding: 16 }}>
                                No service prices found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ServicePriceTable;
