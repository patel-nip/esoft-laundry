import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { ordersAPI } from "../services/api";

function DashboardPage() {
    const [notifications, setNotifications] = useState([]);
    const [stats, setStats] = useState({
        totalToday: 0,
        receivedToday: 0,
        completedToday: 0,
        deliveredToday: 0,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        setLoading(true);
        try {
            const data = await ordersAPI.getAll();
            const allOrders = data.orders || [];

            console.log("📦 Total orders:", allOrders.length);

            console.log("🔍 Full order object:", JSON.stringify(allOrders[0], null, 2));

            // Check ALL field names
            if (allOrders[0]) {
                console.log("📋 Order fields:", Object.keys(allOrders[0]));
            }

            // 🔍 DEBUG: Check what status values exist
            allOrders.forEach((order, index) => {
                console.log(`Order ${index + 1} status:`, order.status, typeof order.status);
            });

            // Calculate stats
            const received = allOrders.filter(o => o.status === "RECEIVED");
            const completed = allOrders.filter(o => o.status === "COMPLETED");
            const delivered = allOrders.filter(o => o.status === "DELIVERED");

            console.log("🔵 RECEIVED orders:", received.length, received);
            console.log("🟢 COMPLETED orders:", completed.length, completed);
            console.log("🟣 DELIVERED orders:", delivered.length, delivered);

            const newStats = {
                totalToday: allOrders.length,
                receivedToday: received.length,
                completedToday: completed.length,
                deliveredToday: delivered.length,
            };

            console.log("📊 Final stats:", newStats);
            setStats(newStats);

            // Notifications
            const notifs = allOrders
                .filter(o => o.status === "COMPLETED")
                .slice(0, 10)
                .map(o => ({
                    code: o.code,
                    customer: o.customer_name,
                    phone: o.customer_phone,
                    eta: o.eta_date ? o.eta_date.split("T")[0] : "N/A",
                    status: o.status,
                }));

            setNotifications(notifs);
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="dashboard-main">
                <Header />
                <div className="dashboard-content">
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 32,
                        }}
                    >
                        <div>
                            <img
                                src="/esoft.jpeg"
                                alt="Esoft logo"
                                style={{
                                    width: 160,
                                    height: 160,
                                    borderRadius: 32,
                                    objectFit: "cover",
                                }}
                            />
                        </div>

                        {/* Stats cards */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                                gap: 16,
                                width: "100%",
                                maxWidth: 600,
                            }}
                        >
                            <div className="stat-card">
                                <div className="stat-value">{stats.totalToday}</div>
                                <div className="stat-label">Orders Today</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">{stats.receivedToday}</div>
                                <div className="stat-label">Received</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">{stats.completedToday}</div>
                                <div className="stat-label">Completed</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">{stats.deliveredToday}</div>
                                <div className="stat-label">Delivered</div>
                            </div>
                        </div>
                    </div>

                    <aside className="notifications">
                        <div
                            style={{
                                padding: "12px 16px",
                                borderBottom: "1px solid #1f2937",
                                fontSize: 14,
                                fontWeight: 600,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span>Notifications</span>
                            {loading && <span className="text-small">Loading...</span>}
                        </div>
                        <div className="notifications-list">
                            {notifications.length === 0 && !loading && (
                                <div style={{ padding: 16, textAlign: "center", color: "#9ca3af" }}>
                                    No notifications
                                </div>
                            )}
                            {notifications.map((n) => (
                                <div key={n.code} className="notification-card">
                                    <div style={{ fontWeight: 600 }}>
                                        Order {n.code} · Customer: {n.customer}
                                    </div>
                                    <div className="text-small">Phone: {n.phone}</div>
                                    <div
                                        style={{
                                            marginTop: 4,
                                            color: n.status === "COMPLETED" ? "#22c55e" : "#f59e0b",
                                            fontWeight: 500,
                                            fontSize: 12,
                                        }}
                                    >
                                        {n.status === "COMPLETED"
                                            ? "✓ Ready for pickup"
                                            : `ETA: ${n.eta}`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default DashboardPage;
