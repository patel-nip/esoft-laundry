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
            setOrders(ordersData.orders || []);

            if (ordersData.orders && ordersData.orders.length > 0) {
                setSelectedOrderId(ordersData.orders[0].id);
            }

            // Fetch NCF ranges
            try {
                const ncfData = await ncfAPI.getRanges();

                // ✅ FIXED: Transform to lookup object with correct field names
                const rangesMap = {};

                if (ncfData.ranges && ncfData.ranges.length > 0) {
                    ncfData.ranges.forEach(range => {
                        // Use series_type as the key (B01, B02, B15)
                        rangesMap[range.series_type] = {
                            label: range.series_type,
                            prefix: range.prefix,
                            series: range.series,
                            initial: range.start_number,      // ✅ From backend transform
                            current: range.current_number,
                            last: range.end_number,           // ✅ From backend transform
                            remaining: range.end_number - range.current_number + 1
                        };
                    });
                }

                setNcfRanges(rangesMap);
            } catch (ncfError) {
                console.warn("Failed to load NCF ranges:", ncfError);
                // Don't fail the whole page if NCF ranges fail to load
                setNcfRanges({});
            }

        } catch (err) {
            console.error("Fetch data error:", err);

            // ✅ IMPROVED: Better error messages
            let errorMessage = "Failed to load orders.";

            if (err.response?.status === 400) {
                errorMessage = "⚠️ Database error. Please ensure all tables are set up correctly.";
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
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
        // ✅ Validate NCF type selection
        if (!ncfType || ncfType === "") {
            setError("⚠️ Please select an NCF type before delivering.");
            setLoading(false);
            return;
        }

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

        alert("✅ Order delivered successfully with NCF assigned!");
    } catch (err) {
        console.error("Deliver order error:", err);
        
        // ✅ IMPROVED: Show backend error message
        const errorMessage = err.response?.data?.message || err.message || "Failed to deliver order";
        setError(errorMessage);
        alert(`❌ ${errorMessage}`);
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

                    {/* ✅ UPDATED: Better error display */}
                    {error && (
                        <div style={{
                            padding: "16px 24px",
                            background: "#991b1b",
                            color: "#fecaca",
                            marginBottom: "16px",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            border: "1px solid #7f1d1d"
                        }}>
                            <span style={{ fontSize: 20 }}>⚠️</span>
                            <span>{error}</span>
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
                            location: selectedOrder.location,
                            handler: selectedOrder.handler
                        }}
                        items={selectedOrder.items?.map((it, idx) => ({
                            id: `${selectedOrder.id}-${idx}`,
                            name: it.garment_name,
                            quantity: it.qty,
                            color: it.color,
                            note: it.note || "",
                            price: it.price || 0,
                            service: it.service || "Wash & Iron",
                            express: it.is_express === "YES"
                        })) || []}
                        subtotal={parseFloat(selectedOrder.subtotal)}
                        tax={parseFloat(selectedOrder.tax)}
                        total={parseFloat(selectedOrder.total)}
                        advance={parseFloat(selectedOrder.paid)}
                        balance={parseFloat(selectedOrder.balance)}
                        estimatedDate={selectedOrder.eta_date}
                        orderNote={selectedOrder.notes}
                    />
                )}
            </div>
        </main>
    </div>
);

}

export default InvoiceOrderPage;
