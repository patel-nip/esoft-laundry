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

function OrderList({ activeTab, orders, selectedOrderId, onSelectOrder }) {
    const renderHead = () => {
        if (activeTab === "completed") {
            return (
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
                    <th>Customer notified</th>
                    <th className="text-right">Total</th>
                    <th className="text-right">Paid</th>
                </tr>
            );
        }
        if (activeTab === "delivered") {
            return (
                <tr>
                    <th>Order</th>
                    <th>Delivery date</th>
                    <th>Delivery time</th>
                    <th>Status</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>User</th>
                    <th>NCF</th>
                    <th className="text-right">Total</th>
                    <th className="text-right">Paid</th>
                </tr>
            );
        }
        // received / all
        return (
            <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Phone 2</th>
                <th>ETA</th>
                <th>User</th>
                <th className="text-right">Total</th>
                <th className="text-right">Paid</th>
                <th className="text-right">Balance</th>
            </tr>
        );
    };

    const renderRow = (order) => {
        const isSelected = order.id === selectedOrderId;

        if (activeTab === "completed") {
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
                    <td>{order.customer_notified || "NO"}</td>
                    <td className="text-right">{parseFloat(order.total).toFixed(2)}</td>
                    <td className="text-right">{parseFloat(order.paid).toFixed(2)}</td>
                </tr>
            );
        }

        if (activeTab === "delivered") {
            return (
                <tr
                    key={order.id}
                    className={
                        isSelected ? "order-row order-row-selected" : "order-row"
                    }
                    onClick={() => onSelectOrder(order.id)}
                >
                    <td>{order.code}</td>
                    <td>{formatDate(order.eta_date)}</td>
                    <td>{order.eta_time}</td>
                    <td>{order.status}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.customer_phone}</td>
                    <td>{order.user_created}</td>
                    <td>{order.ncf_number || "-"}</td>
                    <td className="text-right">{parseFloat(order.total).toFixed(2)}</td>
                    <td className="text-right">{parseFloat(order.paid).toFixed(2)}</td>
                </tr>
            );
        }

        // received / all
        return (
            <tr
                key={order.id}
                className={isSelected ? "order-row order-row-selected" : "order-row"}
                onClick={() => onSelectOrder(order.id)}
            >
                <td>{order.code}</td>
                <td>{formatDate(order.order_date)}</td>
                <td>{order.order_time}</td>
                <td>{order.status}</td>
                <td>{order.customer_name}</td>
                <td>{order.customer_phone}</td>
                <td>{order.customer_phone2 || "-"}</td>
                <td>{formatDate(order.eta_date)}</td>
                <td>{order.user_created}</td>
                <td className="text-right">{parseFloat(order.total || 0).toFixed(2)}</td>
                <td className="text-right">{parseFloat(order.paid || 0).toFixed(2)}</td>
                <td className="text-right">{parseFloat(order.balance || 0).toFixed(2)}</td>
            </tr>
        );
    };

    return (
        <div className="order-list-wrapper">
            <table className="order-table order-status-table">
                <thead>{renderHead()}</thead>
                <tbody>
                    {orders.map(renderRow)}
                    {orders.length === 0 && (
                        <tr>
                            <td colSpan={12} style={{ textAlign: "center", padding: 16 }}>
                                No orders found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default OrderList;
