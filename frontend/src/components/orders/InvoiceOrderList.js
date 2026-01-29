import React from "react";

// Helper function to format date
function formatDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function InvoiceOrderList({
    orders,
    searchMode,
    setSearchMode,
    searchText,
    setSearchText,
    selectedOrderId,
    onSelectOrder,
}) {
    return (
        <div className="invoice-order-list">
            <div className="order-filters">
                <div className="order-filters-left">
                    <span className="order-filters-label">Search by:</span>
                    <label className="order-filters-radio">
                        <input
                            type="radio"
                            checked={searchMode === "code"}
                            onChange={() => setSearchMode("code")}
                        />
                        <span>Order code</span>
                    </label>
                    <label className="order-filters-radio">
                        <input
                            type="radio"
                            checked={searchMode === "name"}
                            onChange={() => setSearchMode("name")}
                        />
                        <span>Name</span>
                    </label>
                    <label className="order-filters-radio">
                        <input
                            type="radio"
                            checked={searchMode === "phone"}
                            onChange={() => setSearchMode("phone")}
                        />
                        <span>Phone</span>
                    </label>
                </div>
                <div className="order-filters-right">
                    <input
                        className="input order-filters-input"
                        placeholder="Type to search..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
            </div>

            <div className="order-list-wrapper">
                <table className="order-table invoice-orders-table">
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>ETA</th>
                            <th>Location</th>
                            <th>Handler</th>
                            <th className="text-right">Total</th>
                            <th className="text-right">Paid</th>
                            <th className="text-right">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            const isSelected = order.id === selectedOrderId;
                            const balance = parseFloat(order.balance || 0);

                            return (
                                <tr
                                    key={order.id}
                                    className={
                                        isSelected ? "order-row order-row-selected" : "order-row"
                                    }
                                    onClick={() => onSelectOrder(order.id)}
                                >
                                    <td>{order.code}</td>
                                    <td>{formatDate(order.order_date)}</td>
                                    <td>{order.order_time}</td>
                                    <td>{order.status}</td>
                                    <td>{order.customer_name}</td>
                                    <td>{order.customer_phone}</td>
                                    <td>{formatDate(order.eta_date)}</td>
                                    <td>{order.location || "-"}</td>
                                    <td>{order.handler || "-"}</td>
                                    <td className="text-right">${parseFloat(order.total || 0).toFixed(2)}</td>
                                    <td className="text-right">${parseFloat(order.paid || 0).toFixed(2)}</td>
                                    <td
                                        className="text-right"
                                        style={{
                                            fontWeight: 600,
                                            color: balance > 0 ? "#ef4444" : balance < 0 ? "#10b981" : "inherit"
                                        }}
                                    >
                                        {balance > 0 && `-$${Math.abs(balance).toFixed(2)}`}
                                        {balance < 0 && `$${Math.abs(balance).toFixed(2)}`}
                                        {balance === 0 && "$0.00"}
                                    </td>
                                </tr>
                            );
                        })}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={12} style={{ textAlign: "center", padding: 16 }}>
                                    No orders to invoice.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InvoiceOrderList;
