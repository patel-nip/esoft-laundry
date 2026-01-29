import React, { useState } from "react";
import ReactDOMServer from "react-dom/server";
import OrderStatusPrint from "./OrderStatusPrint";

function printOrderStatus(order) {
    const html = ReactDOMServer.renderToStaticMarkup(<OrderStatusPrint order={order} />);

    const win = window.open("", "_blank");
    win.document.write(`
        <html>
            <head>
                <title>Order Status</title>
                <style>
                    body { 
                        margin: 0; 
                        font-family: "Times New Roman", serif; 
                        font-size: 14px;
                        padding: 20px;
                    }
                    .invoice-root { max-width: 400px; margin: 0 auto; }
                    .invoice-header { text-align: center; margin-bottom: 20px; }
                    .invoice-title { font-size: 20px; font-weight: bold; }
                    .invoice-section { margin: 16px 0; }
                    .invoice-section--center { text-align: center; }
                    .invoice-subtitle { font-weight: bold; font-size: 16px; }
                </style>
            </head>
            <body>${html}</body>
        </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
}

function OrderItemsPanel({ activeTab, order, onUpdateStatus, onUpdateDetails, onDelete }) {
    const [location, setLocation] = useState("");
    const [handler, setHandler] = useState("");
    const [showPaymentInfo, setShowPaymentInfo] = useState(false);

    if (!order) {
        return (
            <div className="order-items-panel">
                <div className="order-items-header">
                    <h2>Order details</h2>
                </div>
                <p className="text-small">Select an order to see its items.</p>
            </div>
        );
    }

    const totalGarments =
        order.items?.reduce((sum, item) => sum + item.qty, 0) ?? 0;

    function handleMarkCompleted() {
        if (!location || !handler) {
            alert("Please enter location and handler");
            return;
        }
        onUpdateDetails(order.id, {
            status: "COMPLETED",
            location,
            handler
        });
        setLocation("");
        setHandler("");
    }

    function handleNotifyCustomer() {
        const newStatus = order.customer_notified === "YES" ? "NO" : "YES";
        onUpdateDetails(order.id, { customer_notified: newStatus });
    }

    function handleDeleteOrder() {
        if (window.confirm("Are you sure you want to delete this order?")) {
            onDelete(order.id);
        }
    }

    const renderActions = () => {
        if (activeTab === "received") {
            return (
                <>
                    <input
                        className="input input-sm"
                        placeholder="Location (e.g. A, B, C)"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        style={{ marginBottom: 8, width: "100%" }}
                    />
                    <input
                        className="input input-sm"
                        placeholder="Handler name"
                        value={handler}
                        onChange={(e) => setHandler(e.target.value)}
                        style={{ marginBottom: 8, width: "100%" }}
                    />
                    <button
                        className="button-primary order-items-button"
                        onClick={handleMarkCompleted}
                    >
                        Mark as completed
                    </button>
                    <button
                        className="order-items-button-secondary"
                        onClick={() => setShowPaymentInfo(true)}
                    >
                        Payment / installments
                    </button>
                    <button
                        type="button"
                        className="order-items-button-secondary"
                        style={{ marginTop: 8 }}
                        onClick={() => printOrderStatus(order)}
                    >
                        Print status
                    </button>
                    <button
                        className="order-items-button-secondary"
                        style={{ borderColor: "#ef4444", color: "#ef4444", marginTop: 8 }}
                        onClick={handleDeleteOrder}
                    >
                        Delete order
                    </button>
                </>
            );
        }
        if (activeTab === "completed") {
            return (
                <>
                    <button
                        className="order-items-button-secondary"
                        onClick={handleNotifyCustomer}
                    >
                        {order.customer_notified === "YES" ? "Mark NOT notified" : "Mark as notified"}
                    </button>
                    <button
                        className="order-items-button-secondary"
                        onClick={() => setShowPaymentInfo(true)}
                    >
                        Payment & installments
                    </button>
                    <button
                        className="order-items-button-secondary"
                        onClick={() => printOrderStatus(order)}
                    >
                        Reprint order
                    </button>
                    <button
                        className="order-items-button-secondary"
                        style={{ borderColor: "#ef4444", color: "#ef4444", marginTop: 8 }}
                        onClick={handleDeleteOrder}
                    >
                        Delete order
                    </button>
                </>
            );
        }
        if (activeTab === "delivered") {
            return (
                <>
                    <button
                        className="button-primary order-items-button"
                        onClick={() => printOrderStatus(order)}
                    >
                        Reprint invoice
                    </button>
                    <button
                        className="order-items-button-secondary"
                        style={{ borderColor: "#ef4444", color: "#ef4444" }}
                        onClick={handleDeleteOrder}
                    >
                        Delete order
                    </button>
                </>
            );
        }
        return null;
    };

    return (
        <>
            <div className="order-items-panel">
                <div className="order-items-header">
                    <h2>Order {order.code}</h2>
                    <div className="order-items-counter">
                        <span className="order-items-counter-number">{totalGarments}</span>
                        <span className="order-items-counter-label">
                            Garments in this order
                        </span>
                    </div>
                </div>

                <div className="order-items-table-wrapper">
                    <table className="order-table order-items-table">
                        <thead>
                            <tr>
                                <th>Qty</th>
                                <th>Garment</th>
                                <th>Color</th>
                                <th>Service</th>
                                <th>Express</th>
                                <th>Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items?.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.qty}</td>
                                    <td>{item.garment_name}</td>
                                    <td>{item.color || "-"}</td>
                                    <td>{item.service || "-"}</td>
                                    <td>{item.is_express}</td>
                                    <td>{item.note || "-"}</td>
                                </tr>
                            ))}
                            {(order.items?.length ?? 0) === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center", padding: 12 }}>
                                        No garments recorded.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="order-items-footer">
                    <div className="order-items-meta">
                        <div className="text-small">
                            Location:{" "}
                            <span style={{ fontWeight: 500 }}>
                                {order.location || "-"}
                            </span>
                        </div>
                        <div className="text-small">
                            Handler:{" "}
                            <span style={{ fontWeight: 500 }}>
                                {order.handler || "-"}
                            </span>
                        </div>
                        {activeTab === "completed" && (
                            <div className="text-small">
                                Notified:{" "}
                                <span style={{ fontWeight: 500 }}>
                                    {order.customer_notified || "NO"}
                                </span>
                            </div>
                        )}
                        {order.ncf_number && (
                            <div className="text-small">
                                NCF: <span style={{ fontWeight: 500 }}>{order.ncf_number}</span>
                            </div>
                        )}
                    </div>
                    <div className="order-items-actions">{renderActions()}</div>
                </div>
            </div>

            {/* Payment Info Modal */}
            {showPaymentInfo && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        background: "#1e293b",
                        borderRadius: "8px",
                        width: "90%",
                        maxWidth: "450px",
                        maxHeight: "90vh",
                        overflow: "auto"
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: "20px 24px",
                            borderBottom: "1px solid #334155",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <h2 style={{ fontSize: 18, margin: 0 }}>Payment Information</h2>
                            <button
                                onClick={() => setShowPaymentInfo(false)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "#94a3b8",
                                    fontSize: 24,
                                    cursor: "pointer",
                                    padding: 0,
                                    width: 30,
                                    height: 30
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Body */}
                        <div style={{ padding: "24px" }}>
                            {/* Order Info */}
                            <div style={{
                                background: "#0f172a",
                                padding: "16px",
                                borderRadius: "6px",
                                marginBottom: "20px"
                            }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                    <div>
                                        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Order Code</div>
                                        <div style={{ fontWeight: 600, fontSize: 15 }}>{order.code}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Status</div>
                                        <div style={{ fontWeight: 600, fontSize: 15 }}>{order.status}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Location</div>
                                        <div style={{ fontWeight: 500 }}>{order.location || "-"}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Handler</div>
                                        <div style={{ fontWeight: 500 }}>{order.handler || "-"}</div>
                                    </div>
                                </div>
                            </div>

                            {/* ✅ UPDATED: Payment Summary with proper color coding */}
                            <div style={{
                                background: "#0f172a",
                                padding: "16px",
                                borderRadius: "6px",
                                marginBottom: "20px"
                            }}>
                                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Payment Summary</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ color: "#94a3b8" }}>Total</span>
                                        <span style={{ fontWeight: 600 }}>${parseFloat(order.total || 0).toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ color: "#94a3b8" }}>Paid</span>
                                        <span style={{ fontWeight: 600, color: "#10b981" }}>${parseFloat(order.paid || 0).toFixed(2)}</span>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        paddingTop: "10px",
                                        borderTop: "1px solid #334155"
                                    }}>
                                        <span style={{ color: "#94a3b8" }}>
                                            {parseFloat(order.balance || 0) > 0 ? "Balance Due" : parseFloat(order.balance || 0) < 0 ? "Change to Return" : "Balance"}
                                        </span>
                                        <span style={{
                                            fontWeight: 700,
                                            fontSize: 18,
                                            color: parseFloat(order.balance || 0) > 0 ? "#ef4444" : parseFloat(order.balance || 0) < 0 ? "#10b981" : "inherit"
                                        }}>
                                            {parseFloat(order.balance || 0) > 0 && `-$${Math.abs(parseFloat(order.balance)).toFixed(2)}`}
                                            {parseFloat(order.balance || 0) < 0 && `$${Math.abs(parseFloat(order.balance)).toFixed(2)}`}
                                            {parseFloat(order.balance || 0) === 0 && "$0.00"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Info Message */}
                            <div style={{
                                background: "#1e40af",
                                padding: "16px",
                                borderRadius: "6px",
                                marginBottom: "16px",
                                display: "flex",
                                gap: "12px",
                                alignItems: "start"
                            }}>
                                <div style={{ fontSize: 20 }}>ℹ️</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 14 }}>View Only</div>
                                    <div style={{ fontSize: 13, lineHeight: 1.5, color: "#bfdbfe" }}>
                                        To add payments or process installments, please go to the <strong>Invoice Order</strong> page.
                                    </div>
                                </div>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => setShowPaymentInfo(false)}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    background: "#3b82f6",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: "pointer"
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default OrderItemsPanel;
