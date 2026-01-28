import React from "react";

function InvoicePrint({ orderNumber, date, customer, items, subtotal, tax, total, advance, balance, estimatedDate, orderNote }) {
    const totalGarments = items.reduce((sum, i) => sum + i.quantity, 0);

    // Format date properly
    const formatDate = (dateString) => {
        if (!dateString) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // Calculate if overpaid (change) or underpaid (balance due)
    const isOverpaid = balance < 0;
    const changeAmount = isOverpaid ? Math.abs(balance) : 0;
    const balanceDue = !isOverpaid ? balance : 0;

    return (
        <div className="invoice-root" style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            {/* Header with 3 columns: Address Left, Title Center, Date Right */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", borderBottom: "2px solid #000", paddingBottom: "10px" }}>
                {/* Left - Address */}
                <div style={{ fontSize: "10px", lineHeight: "1.4", flex: 1 }}>
                    <div>123 Main Street</div>
                    <div>City Center</div>
                    <div>Open Mon–Sat</div>
                    <div>8:00 AM – 6:00 PM</div>
                </div>

                {/* Center - Title */}
                <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>ESOFT LAUNDRY</div>
                    <div style={{ fontSize: "11px" }}>Quality & Punctuality</div>
                </div>

                {/* Right - Invoice Info */}
                <div style={{ fontSize: "10px", textAlign: "right", flex: 1 }}>
                    <div style={{ fontWeight: "600" }}>Invoice - {orderNumber}</div>
                    <div style={{ marginTop: "4px" }}>{formatDate(date)}</div>
                </div>
            </div>

            {/* Work Order & Customer Info */}
            <div style={{ marginBottom: "16px", fontSize: "11px" }}>
                <div style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "8px" }}>WORK ORDER</div>
                <div style={{ marginBottom: "4px" }}>
                    <strong>No.</strong> {orderNumber || "000001"}
                    <span style={{ marginLeft: "20px" }}><strong>Date:</strong> {formatDate(date)}</span>
                </div>
                <div style={{ marginBottom: "2px" }}>
                    <strong>Client:</strong> {customer ? customer.name : "Walk‑in customer"}
                </div>
                {customer?.phone && (
                    <div>
                        <strong>Phone:</strong> {customer.phone}
                    </div>
                )}
            </div>

            {/* Items Table - Now with service breakdown */}
            <div style={{ marginBottom: "16px" }}>
                <div style={{ fontWeight: "bold", fontSize: "11px", borderBottom: "1px solid #000", paddingBottom: "4px", marginBottom: "8px" }}>
                    DETAILS
                </div>

                {items.map((item, index) => (
                    <div key={item.id} style={{ fontSize: "10px", borderBottom: "1px solid #ddd", paddingTop: "8px", paddingBottom: "8px" }}>
                        {/* Item Header */}
                        <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                            {index + 1}. {item.name} - {item.color || "No color"}
                        </div>

                        {/* Service breakdown */}
                        <div style={{ paddingLeft: "12px", marginBottom: "4px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                                <span>• {item.service} (Qty: {item.quantity})</span>
                                <span style={{ fontWeight: "600" }}>{(item.price * item.quantity).toFixed(2)}</span>
                            </div>

                            {item.express && (
                                <div style={{ display: "flex", justifyContent: "space-between", color: "#d97706", fontWeight: "600", marginBottom: "2px" }}>
                                    <span>• Express service</span>
                                    <span>Included</span>
                                </div>
                            )}

                            {item.note && (
                                <div style={{ fontSize: "9px", color: "#666", marginTop: "4px" }}>
                                    Note: {item.note}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <div style={{ marginTop: "8px", fontSize: "11px", paddingTop: "8px", borderTop: "1px solid #000" }}>
                    Total garments: {totalGarments}
                </div>
            </div>

            {/* Totals Section */}
            <div style={{ marginBottom: "16px", fontSize: "11px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span>SUBTOTAL:</span>
                    <span>{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span>TAX (ITBIS):</span>
                    <span>{tax.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span>DISCOUNT:</span>
                    <span>0.00</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "bold", paddingTop: "6px", borderTop: "1px solid #000", marginBottom: "4px" }}>
                    <span>Total:</span>
                    <span>{total.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span>Advance:</span>
                    <span>{advance.toFixed(2)}</span>
                </div>

                {/* Show either Change (green) or Balance Due (red) */}
                {isOverpaid ? (
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px",
                        fontSize: "13px",
                        fontWeight: "bold",
                        color: "#16a34a",
                        border: "2px solid #16a34a",
                        borderRadius: "4px",
                        backgroundColor: "#dcfce7"
                    }}>
                        <span>CHANGE TO RETURN:</span>
                        <span>${changeAmount.toFixed(2)}</span>
                    </div>
                ) : balanceDue > 0 ? (
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px",
                        fontSize: "13px",
                        fontWeight: "bold",
                        color: "#dc2626",
                        border: "2px solid #dc2626",
                        borderRadius: "4px",
                        backgroundColor: "#fee2e2"
                    }}>
                        <span>BALANCE DUE:</span>
                        <span>-${balanceDue.toFixed(2)}</span>
                    </div>
                ) : (
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px",
                        fontSize: "13px",
                        fontWeight: "bold",
                        color: "#16a34a",
                        border: "2px solid #16a34a",
                        borderRadius: "4px",
                        backgroundColor: "#dcfce7"
                    }}>
                        <span>FULLY PAID</span>
                        <span>✓</span>
                    </div>
                )}
            </div>

            {/* Estimated Delivery */}
            <div style={{ marginBottom: "16px", paddingTop: "12px", borderTop: "1px solid #ddd", textAlign: "center", fontSize: "11px" }}>
                <div style={{ fontWeight: "600", marginBottom: "4px" }}>Estimated delivery</div>
                <div style={{ fontSize: "12px", fontWeight: "600" }}>{formatDate(estimatedDate)}</div>
            </div>

            {/* Order Note */}
            {orderNote && (
                <div style={{
                    margin: "16px 0",
                    padding: "10px",
                    fontSize: "11px",
                    textAlign: "center",
                    color: "red",
                    fontWeight: "bold",
                    border: "1px solid red",
                    borderRadius: "4px",
                    backgroundColor: "#ffe6e6"
                }}>
                    ⚠️ NOTE: {orderNote}
                </div>
            )}

            {/* Footer */}
            <div style={{ fontSize: "9px", textAlign: "center", marginTop: "20px", paddingTop: "12px", borderTop: "1px solid #ddd", lineHeight: "1.5" }}>
                <div>We are not responsible if your clothes fade or shrink.</div>
                <div>We are not responsible for garments left over 90 days.</div>
                <div style={{ marginTop: "8px", fontWeight: "bold", fontSize: "11px" }}>Come back soon!</div>
            </div>
        </div>
    );
}

export default InvoicePrint;
