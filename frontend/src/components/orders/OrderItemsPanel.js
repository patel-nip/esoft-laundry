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
                    <button className="order-items-button-secondary">
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
                    <button className="order-items-button-secondary">
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
    );
}

export default OrderItemsPanel;
