import React from "react";

function CustomerOrdersPanel({ customer, orders }) {
    const totals = orders.reduce(
        (acc, o) => {
            acc.subtotal += parseFloat(o.subtotal || 0);
            acc.tax += parseFloat(o.tax || 0);
            acc.discount += parseFloat(o.discount || 0);
            acc.total += parseFloat(o.total || 0);
            acc.cash += parseFloat(o.cash || 0);
            acc.card += parseFloat(o.card || 0);
            acc.transfer += parseFloat(o.transfer || 0);
            return acc;
        },
        { subtotal: 0, tax: 0, discount: 0, total: 0, cash: 0, card: 0, transfer: 0 }
    );

    return (
        <div className="customer-orders-panel">
            <h2 className="customer-orders-title">
                {customer ? `Orders for ${customer.name}` : "Customer orders"}
            </h2>

            {!customer && (
                <p className="text-small">Select a customer to see their orders.</p>
            )}

            {customer && (
                <>
                    <div className="text-small" style={{ marginBottom: 6 }}>
                        Phone: <strong>{customer.phone}</strong>{" "}
                        {customer.rnc && (
                            <>
                                · RNC: <strong>{customer.rnc}</strong>
                            </>
                        )}
                    </div>

                    <div className="customer-orders-table-wrapper">
                        <table className="order-table customer-orders-table">
                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>NCF</th>
                                    <th>Location</th>
                                    <th className="text-right">Subtotal</th>
                                    <th className="text-right">ITBIS</th>
                                    <th className="text-right">Discount</th>
                                    <th className="text-right">Total</th>
                                    <th className="text-right">Paid</th>
                                    <th className="text-right">Cash</th>
                                    <th className="text-right">Card</th>
                                    <th className="text-right">Transfer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o) => (
                                    <tr key={o.id}>
                                        <td>{o.code}</td>
                                        <td>{o.order_date}</td>
                                        <td>{o.order_time}</td>
                                        <td>{o.status}</td>
                                        <td>{o.ncf_number || "-"}</td>
                                        <td>{o.location || "-"}</td>
                                        <td className="text-right">{parseFloat(o.subtotal).toFixed(2)}</td>
                                        <td className="text-right">{parseFloat(o.tax).toFixed(2)}</td>
                                        <td className="text-right">{parseFloat(o.discount).toFixed(2)}</td>
                                        <td className="text-right">{parseFloat(o.total).toFixed(2)}</td>
                                        <td className="text-right">{parseFloat(o.paid).toFixed(2)}</td>
                                        <td className="text-right">{parseFloat(o.cash || 0).toFixed(2)}</td>
                                        <td className="text-right">{parseFloat(o.card || 0).toFixed(2)}</td>
                                        <td className="text-right">{parseFloat(o.transfer || 0).toFixed(2)}</td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={14} style={{ textAlign: "center", padding: 12 }}>
                                            No orders for this customer yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="customer-orders-totals">
                        <div className="customer-orders-totals-row">
                            <span>Subtotal</span>
                            <span>{totals.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="customer-orders-totals-row">
                            <span>ITBIS (Tax)</span>
                            <span>{totals.tax.toFixed(2)}</span>
                        </div>
                        <div className="customer-orders-totals-row">
                            <span>Discount</span>
                            <span>{totals.discount.toFixed(2)}</span>
                        </div>
                        <div className="customer-orders-totals-row">
                            <span>Total</span>
                            <span>{totals.total.toFixed(2)}</span>
                        </div>
                        <div className="customer-orders-totals-row">
                            <span>Cash</span>
                            <span>{totals.cash.toFixed(2)}</span>
                        </div>
                        <div className="customer-orders-totals-row">
                            <span>Card</span>
                            <span>{totals.card.toFixed(2)}</span>
                        </div>
                        <div className="customer-orders-totals-row">
                            <span>Transfer</span>
                            <span>{totals.transfer.toFixed(2)}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default CustomerOrdersPanel;
