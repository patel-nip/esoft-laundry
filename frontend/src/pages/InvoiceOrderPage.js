import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import NcfTypeSelector from "../components/orders/NcfTypeSelector";
import InvoiceOrderList from "../components/orders/InvoiceOrderList";
import InvoiceSummaryPanel from "../components/orders/InvoiceSummaryPanel";
import InvoicePrint from "../components/orders/InvoicePrint";
import { ordersAPI, ncfAPI } from "../services/api";

function InvoiceOrderPage() {
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [searchMode, setSearchMode] = useState("code");
    const [searchText, setSearchText] = useState("");
    const [ncfType, setNcfType] = useState("NONE");
    const [orders, setOrders] = useState([]);
    const [ncfRanges, setNcfRanges] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch completed orders and NCF ranges on mount
    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        setError("");

        try {
            // Fetch completed orders
            const ordersData = await ordersAPI.getAll("COMPLETED");
            setOrders(ordersData.orders);

            if (ordersData.orders.length > 0) {
                setSelectedOrderId(ordersData.orders[0].id);
            }

            // Fetch NCF ranges
            const ncfData = await ncfAPI.getRanges();

            // Transform to lookup object
            const rangesMap = {
                NONE: null,
            };

            ncfData.ranges.forEach(range => {
                rangesMap[range.ncf_type] = {
                    label: range.ncf_type,
                    prefix: range.prefix,
                    initial: range.initial_number,
                    current: range.current_number,
                    last: range.last_number,
                };
            });

            setNcfRanges(rangesMap);
        } catch (err) {
            setError(err.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    }

    const ncfInfo = ncfRanges[ncfType] || null;

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            if (!searchText.trim()) return true;
            const field =
                searchMode === "code"
                    ? order.code
                    : searchMode === "name"
                        ? order.customer_name
                        : order.customer_phone;
            return field?.toLowerCase().includes(searchText.toLowerCase());
        });
    }, [orders, searchMode, searchText]);

    const selectedOrder =
        filteredOrders.find((o) => o.id === selectedOrderId) ?? filteredOrders[0] ?? null;

    async function handleDeliverOrder(orderId, paymentData) {
        setLoading(true);
        setError("");

        try {
            // ✅ Update: Backend now auto-assigns NCF
            await ordersAPI.update(orderId, {
                status: "DELIVERED",
                ncf_type: ncfType !== "NONE" ? ncfType : null,
            });

            // Add payment if amount provided
            if (paymentData.amount > 0) {
                await ordersAPI.addPayment(orderId, {
                    amount: paymentData.amount,
                    payment_method: paymentData.method,
                });
            }

            // Refresh list
            await fetchData();

            alert("Order delivered successfully with NCF assigned!");
        } catch (err) {
            setError(err.message || "Failed to deliver order");
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="dashboard-main">
                <Header />
                <div className="dashboard-content invoice-layout">
                    <section className="invoice-main">
                        <div className="invoice-header-bar">
                            <h1 className="invoice-title">Invoice orders</h1>
                        </div>

                        {error && (
                            <div style={{ padding: "12px 20px", background: "#991b1b", color: "#fecaca" }}>
                                {error}
                            </div>
                        )}

                        <NcfTypeSelector
                            selected={ncfType}
                            onChange={setNcfType}
                            ncfInfo={ncfInfo}
                        />

                        {loading ? (
                            <div style={{ padding: 20, textAlign: "center" }}>Loading...</div>
                        ) : (
                            <InvoiceOrderList
                                orders={filteredOrders}
                                searchMode={searchMode}
                                setSearchMode={setSearchMode}
                                searchText={searchText}
                                setSearchText={setSearchText}
                                selectedOrderId={selectedOrderId}
                                onSelectOrder={setSelectedOrderId}
                            />
                        )}
                    </section>

                    <aside className="invoice-sidebar">
                        <InvoiceSummaryPanel
                            order={selectedOrder}
                            ncfType={ncfType}
                            ncfInfo={ncfInfo}
                            onDeliver={handleDeliverOrder}
                            loading={loading}
                        />
                    </aside>
                </div>

                <div id="invoice-order-print" style={{ display: "none" }}>
                    {selectedOrder && (
                        <InvoicePrint
                            orderNumber={selectedOrder.code}
                            date={selectedOrder.order_date}
                            customer={{
                                name: selectedOrder.customer_name,
                                phone: selectedOrder.customer_phone,
                                rnc: selectedOrder.customer_rnc,
                                location: selectedOrder.location,  // ✅ ADDED
                                handler: selectedOrder.handler      // ✅ ADDED
                            }}
                            items={selectedOrder.items?.map((it, idx) => ({
                                id: `${selectedOrder.id}-${idx}`,
                                name: it.garment_name,
                                quantity: it.qty,
                                color: it.color,
                                note: it.note || "",
                                price: it.price || 0,
                                service: it.service || "Wash & Iron",  // ✅ ADDED
                                express: it.is_express === "YES"       // ✅ ADDED
                            })) || []}
                            subtotal={parseFloat(selectedOrder.subtotal)}
                            tax={parseFloat(selectedOrder.tax)}
                            total={parseFloat(selectedOrder.total)}
                            advance={parseFloat(selectedOrder.paid)}
                            balance={parseFloat(selectedOrder.balance)}
                            estimatedDate={selectedOrder.eta_date}
                            orderNote={selectedOrder.notes}  // ✅ ADDED (for order notes if any)
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

export default InvoiceOrderPage;
