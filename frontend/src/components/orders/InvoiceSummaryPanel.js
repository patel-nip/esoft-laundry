import React, { useState } from "react";

function InvoiceSummaryPanel({ order, ncfType, ncfInfo, onDeliver, loading }) {
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    if (!order) {
        return (
            <div className="invoice-summary">
                <h2 className="invoice-summary-title">Invoice details</h2>
                <p className="text-small">Select an order to invoice.</p>
            </div>
        );
    }

    const subtotal = parseFloat(order.subtotal);
    const tax = parseFloat(order.tax);
    const discount = parseFloat(order.discount);
    const total = parseFloat(order.total);
    const paid = parseFloat(order.paid || 0);
    const balance = parseFloat(order.balance);

    // Calculate if overpaid (change) or underpaid (balance due)
    const isOverpaid = balance < 0;
    const changeAmount = isOverpaid ? Math.abs(balance) : 0;
    const balanceDue = !isOverpaid ? balance : 0;

    function handleProcessDelivery() {
        if (balanceDue > 0) {
            setShowPaymentModal(true);
        } else {
            confirmDeliver();
        }
    }

    function confirmDeliver() {
        onDeliver(order.id, {
            amount: paymentAmount,
            method: paymentMethod,
        });
        setShowPaymentModal(false);
        setPaymentAmount(0);
    }

    function printInvoice() {
        const printContents = document.getElementById("invoice-order-print").innerHTML;
        const win = window.open("", "_blank");
        win.document.write(`
            <html>
              <head>
                <title>Invoice - ${order.code}</title>
                <style>
                  body { margin: 0; font-family: "Times New Roman", serif; }
                </style>
              </head>
              <body>${printContents}</body>
            </html>
        `);
        win.document.close();
        win.focus();
        win.print();
        win.close();
    }

    return (
        <div className="invoice-summary">
            <h2 className="invoice-summary-title">
                Order {order.code} · {order.customer_name}
            </h2>

            <div className="invoice-summary-row">
                <span className="text-small">Receipt type:</span>
                <span className="text-small">
                    {ncfType === "NONE"
                        ? "No tax receipt"
                        : ncfInfo
                            ? `${ncfInfo.prefix} · ${ncfInfo.label}`
                            : "-"}
                </span>
            </div>

            <div className="invoice-summary-block">
                <div className="text-small">
                    Estimated delivery: <strong>{order.eta_date}</strong>
                </div>
                <div className="text-small">
                    Location: <strong>{order.location || "-"}</strong>
                </div>
                <div className="text-small">
                    Handler: <strong>{order.handler || "-"}</strong>
                </div>
            </div>

            <div className="invoice-items-table-wrapper">
                <table className="order-table invoice-items-table">
                    <thead>
                        <tr>
                            <th>Qty</th>
                            <th>Garment</th>
                            <th>Color</th>
                            <th>Service</th>
                            <th>Express</th>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="invoice-totals">
                <div className="invoice-totals-row">
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)}</span>
                </div>
                <div className="invoice-totals-row">
                    <span>Tax (ITBIS 18%)</span>
                    <span>{tax.toFixed(2)}</span>
                </div>
                <div className="invoice-totals-row">
                    <span>Discount</span>
                    <span>{discount.toFixed(2)}</span>
                </div>
                <div className="invoice-totals-row invoice-totals-total">
                    <span>Total</span>
                    <span>{total.toFixed(2)}</span>
                </div>
                <div className="invoice-totals-row">
                    <span>Paid</span>
                    <span>{paid.toFixed(2)}</span>
                </div>

                {/* Show either Change (green) or Balance Due (red) */}
                {isOverpaid ? (
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#22c55e",
                        borderTop: "1px solid #374151",
                        marginTop: "8px"
                    }}>
                        <span>Change to Return</span>
                        <span>${changeAmount.toFixed(2)}</span>
                    </div>
                ) : balanceDue > 0 ? (
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#ef4444",
                        borderTop: "1px solid #374151",
                        marginTop: "8px"
                    }}>
                        <span>Balance Due</span>
                        <span>-${balanceDue.toFixed(2)}</span>
                    </div>
                ) : (
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#22c55e",
                        borderTop: "1px solid #374151",
                        marginTop: "8px"
                    }}>
                        <span>Fully Paid</span>
                        <span>✓</span>
                    </div>
                )}
            </div>

            <div className="invoice-actions">
                <button
                    className="button-primary invoice-action-main"
                    onClick={handleProcessDelivery}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Process delivery"}
                </button>
                <button
                    className="invoice-action-secondary"
                    onClick={printInvoice}
                >
                    Preview & print invoice
                </button>
            </div>

            {/* Payment Modal */}
            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="modal-backdrop">
                    <div className="modal" style={{ minWidth: 350 }}>
                        <button
                            type="button"
                            className="modal-close"
                            onClick={() => {
                                setShowPaymentModal(false);
                                setPaymentAmount(0);
                            }}
                        >
                            ×
                        </button>

                        <h3 style={{ marginBottom: 12, fontSize: "16px" }}>Add Payment</h3>

                        {/* Dynamic Outstanding Balance / Change */}
                        <div style={{
                            marginBottom: 16,
                            padding: "12px",
                            background: paymentAmount >= balanceDue ? "#064e3b" : "#7f1d1d",
                            color: paymentAmount >= balanceDue ? "#6ee7b7" : "#fecaca",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: "600",
                            textAlign: "center"
                        }}>
                            {paymentAmount > balanceDue ? (
                                <>
                                    <div style={{ marginBottom: "4px" }}>Fully Paid ✓</div>
                                    <div style={{ fontSize: "16px" }}>Change: ${(paymentAmount - balanceDue).toFixed(2)}</div>
                                </>
                            ) : paymentAmount === balanceDue ? (
                                <>Fully Paid ✓</>
                            ) : (
                                <>Outstanding balance: ${(balanceDue - paymentAmount).toFixed(2)}</>
                            )}
                        </div>

                        <label style={{ display: "block", marginBottom: 12 }}>
                            <span className="text-small" style={{ marginBottom: "4px", display: "block" }}>Payment Method</span>
                            <select
                                className="input"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                style={{ width: "100%" }}
                            >
                                <option value="CASH">Cash</option>
                                <option value="CARD">Card</option>
                                <option value="TRANSFER">Transfer</option>
                            </select>
                        </label>

                        <label style={{ display: "block", marginBottom: 16 }}>
                            <span className="text-small" style={{ marginBottom: "4px", display: "block" }}>Amount</span>
                            <input
                                type="number"
                                className="input"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                                style={{ width: "100%" }}
                                min="0"
                                step="0.01"
                            />
                        </label>

                        {/* Show warning if payment is insufficient */}
                        {paymentAmount > 0 && paymentAmount < balanceDue && (
                            <div style={{
                                padding: "10px",
                                background: "#7f1d1d",
                                color: "#fecaca",
                                borderRadius: "6px",
                                fontSize: "12px",
                                marginBottom: "12px",
                                textAlign: "center"
                            }}>
                                ⚠️ Payment is insufficient. Remaining: ${(balanceDue - paymentAmount).toFixed(2)}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: 8 }}>
                            <button
                                className="button-primary"
                                onClick={confirmDeliver}
                                disabled={loading || paymentAmount < balanceDue}
                                style={{
                                    flex: 1,
                                    opacity: paymentAmount < balanceDue ? 0.5 : 1,
                                    cursor: paymentAmount < balanceDue ? "not-allowed" : "pointer"
                                }}
                            >
                                {loading ? "Processing..." : "Confirm & Deliver"}
                            </button>
                            <button
                                className="button-secondary"
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setPaymentAmount(0);
                                }}
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InvoiceSummaryPanel;
