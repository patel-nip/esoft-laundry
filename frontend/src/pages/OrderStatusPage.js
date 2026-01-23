import React, { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import OrderFilters from "../components/orders/OrderFilters";
import OrderList from "../components/orders/OrderList";
import OrderItemsPanel from "../components/orders/OrderItemsPanel";
import { ordersAPI } from "../services/api";

function OrderStatusPage() {
    const [activeTab, setActiveTab] = useState("received");
    const [searchMode, setSearchMode] = useState("code");
    const [searchText, setSearchText] = useState("");
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Use useCallback to fix ESLint warning
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const statusMap = {
                received: "RECEIVED",
                completed: "COMPLETED",
                delivered: "DELIVERED",
                all: "",
            };

            const data = await ordersAPI.getAll(statusMap[activeTab]);
            setOrders(data.orders);

            // Auto-select first order if none selected
            if (data.orders.length > 0 && !selectedOrderId) {
                setSelectedOrderId(data.orders[0].id);
            }
        } catch (err) {
            console.error("Fetch orders error:", err);
            setError(err.message || "Failed to load orders. Make sure backend is running.");
        } finally {
            setLoading(false);
        }
    }, [activeTab, selectedOrderId]);

    // Fetch orders when tab changes
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Filter orders based on search
    const filtered = useMemo(() => {
        if (!searchText.trim()) return orders;

        return orders.filter((order) => {
            const value =
                searchMode === "code"
                    ? order.code
                    : searchMode === "name"
                    ? order.customer_name
                    : order.customer_phone;
            return value?.toLowerCase().includes(searchText.toLowerCase());
        });
    }, [orders, searchText, searchMode]);

    const selectedOrder =
        filtered.find((o) => o.id === selectedOrderId) || filtered[0] || null;

    // Update order status (mark as completed, etc.)
    async function handleUpdateStatus(orderId, newStatus) {
        try {
            await ordersAPI.update(orderId, { status: newStatus });
            fetchOrders(); // Refresh list
        } catch (err) {
            setError(err.message);
        }
    }

    // Update location/handler
    async function handleUpdateOrderDetails(orderId, updates) {
        try {
            await ordersAPI.update(orderId, updates);
            fetchOrders();
        } catch (err) {
            setError(err.message);
        }
    }

    // Delete order
    async function handleDeleteOrder(orderId) {
        if (!window.confirm("Are you sure you want to delete this order?")) return;

        try {
            await ordersAPI.delete(orderId);
            fetchOrders();
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="dashboard-main">
                <Header />
                <div className="dashboard-content order-status-layout">
                    <section className="order-status-main">
                        <div className="order-status-tabs">
                            <button
                                className={
                                    activeTab === "all"
                                        ? "order-status-tab order-status-tab-active"
                                        : "order-status-tab"
                                }
                                onClick={() => setActiveTab("all")}
                            >
                                All
                            </button>
                            <button
                                className={
                                    activeTab === "received"
                                        ? "order-status-tab order-status-tab-active"
                                        : "order-status-tab"
                                }
                                onClick={() => setActiveTab("received")}
                            >
                                Received
                            </button>
                            <button
                                className={
                                    activeTab === "completed"
                                        ? "order-status-tab order-status-tab-active"
                                        : "order-status-tab"
                                }
                                onClick={() => setActiveTab("completed")}
                            >
                                Completed
                            </button>
                            <button
                                className={
                                    activeTab === "delivered"
                                        ? "order-status-tab order-status-tab-active"
                                        : "order-status-tab"
                                }
                                onClick={() => setActiveTab("delivered")}
                            >
                                Delivered
                            </button>
                        </div>

                        {error && (
                            <div style={{ padding: "12px 20px", background: "#991b1b", color: "#fecaca" }}>
                                {error}
                            </div>
                        )}

                        <OrderFilters
                            searchMode={searchMode}
                            setSearchMode={setSearchMode}
                            searchText={searchText}
                            setSearchText={setSearchText}
                        />

                        {loading ? (
                            <div style={{ padding: "20px", textAlign: "center" }}>Loading orders...</div>
                        ) : (
                            <OrderList
                                orders={filtered}
                                selectedOrderId={selectedOrderId}
                                onSelectOrder={setSelectedOrderId}
                                activeTab={activeTab}
                            />
                        )}
                    </section>

                    <aside className="order-status-sidebar">
                        <OrderItemsPanel
                            order={selectedOrder}
                            activeTab={activeTab}
                            onUpdateStatus={handleUpdateStatus}
                            onUpdateDetails={handleUpdateOrderDetails}
                            onDelete={handleDeleteOrder}
                        />
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default OrderStatusPage;
