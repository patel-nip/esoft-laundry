import React from "react";

function OrderStatusPrint({ order }) {
    if (!order) return null;

    return (
        <div className="invoice-root">
            <div className="invoice-header">
                <div className="invoice-title">ESOFT LAUNDRY</div>
                <div>Quality & Punctuality</div>
                <div>123 Main Street, City Center</div>
                <div>Open Mon–Sat 8:00 AM – 6:00 PM</div>
            </div>

            <div className="invoice-section invoice-section--center">
                <div className="invoice-subtitle">Order status</div>
            </div>

            <div className="invoice-section" style={{ textAlign: "left", lineHeight: 1.8 }}>
                <div><strong>Order</strong> {order.code}</div>
                <div style={{ marginTop: 4 }}></div>
                <div><strong>Customer:</strong> {order.customer_name}</div>
                <div><strong>Phone:</strong> {order.customer_phone || "N/A"}</div>
                <div style={{ marginTop: 4 }}></div>
                <div><strong>Status:</strong> {order.status}</div>
                <div><strong>ETA:</strong> {order.eta_date}</div>

                {/* Show handler info for COMPLETED and DELIVERED */}
                {(order.status === "COMPLETED" || order.status === "DELIVERED") && order.handler_name && (
                    <>
                        <div style={{ marginTop: 4 }}></div>
                        <div><strong>Handler:</strong> {order.handler_name}</div>
                    </>
                )}

                {/* Show delivery address for DELIVERED status */}
                {order.status === "DELIVERED" && order.customer_address && (
                    <>
                        <div style={{ marginTop: 4 }}></div>
                        <div><strong>Delivery Address:</strong></div>
                        <div>{order.customer_address}</div>
                    </>
                )}

                <div style={{ marginTop: 8 }}></div>
                <div><strong>Total:</strong> ${parseFloat(order.total || 0).toFixed(2)}</div>
            </div>

            <div style={{ marginTop: 16, fontSize: "11px", textAlign: "center" }}>
                <div>We are not responsible if your clothes fade or shrink.</div>
                <div>We are not responsible for garments left over 90 days.</div>
                <div style={{ marginTop: 8, fontWeight: "bold" }}>Come back soon!</div>
            </div>
        </div>
    );
}

export default OrderStatusPrint;
