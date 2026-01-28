import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { reportsAPI } from "../services/api";

function ReportsServicesPrint({ fromDate, toDate, rows }) {
    return (
        <div style={{
            padding: "20px",
            fontFamily: "'Times New Roman', serif",
            fontSize: "11px"
        }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>
                    ESOFT LAUNDRY
                </div>
                <div style={{ fontSize: "14px", marginBottom: "4px" }}>
                    Report of services performed
                </div>
                <div style={{ fontSize: "12px" }}>
                    Period: {fromDate} to {toDate}
                </div>
            </div>

            {/* Table */}
            <table style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
                fontSize: "10px"
            }}>
                <thead>
                    <tr style={{
                        borderBottom: "2px solid #000",
                        backgroundColor: "#f0f0f0"
                    }}>
                        <th style={{ padding: "8px 4px", textAlign: "left", borderBottom: "1px solid #000" }}>Order</th>
                        <th style={{ padding: "8px 4px", textAlign: "left", borderBottom: "1px solid #000" }}>Date</th>
                        <th style={{ padding: "8px 4px", textAlign: "left", borderBottom: "1px solid #000" }}>Customer</th>
                        <th style={{ padding: "8px 4px", textAlign: "left", borderBottom: "1px solid #000" }}>RNC</th>
                        <th style={{ padding: "8px 4px", textAlign: "left", borderBottom: "1px solid #000" }}>NCF</th>
                        <th style={{ padding: "8px 4px", textAlign: "center", borderBottom: "1px solid #000" }}>Status</th>
                        <th style={{ padding: "8px 4px", textAlign: "right", borderBottom: "1px solid #000" }}>Subtotal</th>
                        <th style={{ padding: "8px 4px", textAlign: "right", borderBottom: "1px solid #000" }}>ITBIS</th>
                        <th style={{ padding: "8px 4px", textAlign: "right", borderBottom: "1px solid #000" }}>Discount</th>
                        <th style={{ padding: "8px 4px", textAlign: "right", borderBottom: "1px solid #000" }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={row.id} style={{
                            borderBottom: "1px solid #ddd",
                            backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9"
                        }}>
                            <td style={{ padding: "6px 4px" }}>{row.code}</td>
                            <td style={{ padding: "6px 4px" }}>{row.order_date}</td>
                            <td style={{ padding: "6px 4px" }}>{row.customer_name}</td>
                            <td style={{ padding: "6px 4px" }}>{row.customer_rnc || "-"}</td>
                            <td style={{ padding: "6px 4px" }}>{row.ncf_number || "-"}</td>
                            <td style={{
                                padding: "6px 4px",
                                textAlign: "center",
                                fontWeight: "600",
                                color: row.status === 'DELIVERED' ? '#16a34a' : row.status === 'COMPLETED' ? '#2563eb' : '#ea580c'
                            }}>
                                {row.status}
                            </td>
                            <td style={{ padding: "6px 4px", textAlign: "right" }}>
                                {parseFloat(row.subtotal).toFixed(2)}
                            </td>
                            <td style={{ padding: "6px 4px", textAlign: "right" }}>
                                {parseFloat(row.tax).toFixed(2)}
                            </td>
                            <td style={{ padding: "6px 4px", textAlign: "right" }}>
                                {parseFloat(row.discount).toFixed(2)}
                            </td>
                            <td style={{ padding: "6px 4px", textAlign: "right" }}>
                                {parseFloat(row.total).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer */}
            <div style={{
                marginTop: "40px",
                textAlign: "center",
                fontSize: "10px",
                color: "#666"
            }}>
                <div>Generated on {new Date().toLocaleString()}</div>
            </div>
        </div>
    );
}

function printHtmlFromDiv(divId, title = "Print") {
    const el = document.getElementById(divId);
    if (!el) return;

    const html = el.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { 
            margin: 0; 
            font-family: "Times New Roman", serif;
          }
          @media print {
            body { margin: 0; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
          }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
}

function ReportsServicesPage() {
    const today = new Date().toISOString().split("T")[0];
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const [fromDate, setFromDate] = useState(lastMonth);
    const [toDate, setToDate] = useState(today);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchReport = useCallback(async function () {
        if (!fromDate || !toDate) {
            alert("Please select both from and to dates");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = await reportsAPI.getServices(fromDate, toDate);
            setOrders(data.orders);
        } catch (err) {
            setError(err.message || "Failed to fetch report");
        } finally {
            setLoading(false);
        }
    }, [fromDate, toDate]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="dashboard-main">
                <Header />
                <div className="dashboard-content reports-layout">
                    <section className="reports-main">
                        <div className="reports-header-bar">
                            <h1 className="reports-title">Report of services performed</h1>
                        </div>

                        {error && (
                            <div style={{ padding: "12px 20px", background: "#991b1b", color: "#fecaca" }}>
                                {error}
                            </div>
                        )}

                        <div className="reports-filters">
                            <div className="reports-filter-group">
                                <label className="reports-filter-label">From:</label>
                                <input
                                    type="date"
                                    className="input reports-date-input"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                            </div>
                            <div className="reports-filter-group">
                                <label className="reports-filter-label">To:</label>
                                <input
                                    type="date"
                                    className="input reports-date-input"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                            </div>
                            <button
                                className="button-primary reports-search-button"
                                type="button"
                                onClick={fetchReport}
                                disabled={loading}
                            >
                                {loading ? "Loading..." : "Search"}
                            </button>
                        </div>

                        {loading ? (
                            <div style={{ padding: 20, textAlign: "center" }}>Loading report...</div>
                        ) : (
                            <>
                                <div className="reports-table-wrapper">
                                    <table className="order-table reports-services-table">
                                        <thead>
                                            <tr>
                                                <th>Order</th>
                                                <th>Delivery date</th>
                                                <th>Customer</th>
                                                <th>RNC</th>
                                                <th>NCF</th>
                                                <th style={{ textAlign: "center" }}>Status</th>
                                                <th className="text-right">Subtotal</th>
                                                <th className="text-right">ITBIS</th>
                                                <th className="text-right">Discount</th>
                                                <th className="text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((row) => (
                                                <tr key={row.id}>
                                                    <td>{row.code}</td>
                                                    <td>{new Date(row.order_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                                    <td>{row.customer_name}</td>
                                                    <td>{row.customer_rnc || "-"}</td>
                                                    <td>{row.ncf_number || "-"}</td>
                                                    <td style={{
                                                        textAlign: "center",
                                                        fontWeight: "600",
                                                        color: row.status === 'DELIVERED' ? '#16a34a' : row.status === 'COMPLETED' ? '#2563eb' : '#ea580c'
                                                    }}>
                                                        {row.status}
                                                    </td>
                                                    <td className="text-right">
                                                        {parseFloat(row.subtotal).toFixed(2)}
                                                    </td>
                                                    <td className="text-right">
                                                        {parseFloat(row.tax).toFixed(2)}
                                                    </td>
                                                    <td className="text-right">
                                                        {parseFloat(row.discount).toFixed(2)}
                                                    </td>
                                                    <td className="text-right">
                                                        {parseFloat(row.total).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                            {orders.length === 0 && (
                                                <tr>
                                                    <td colSpan={10} style={{ textAlign: "center", padding: 16 }}>
                                                        No services found for this period.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="reports-footer">
                                    <button
                                        type="button"
                                        className="button-primary reports-print-button"
                                        onClick={() =>
                                            printHtmlFromDiv("reports-services-print", "Services report")
                                        }
                                    >
                                        Print report
                                    </button>
                                </div>
                            </>
                        )}
                    </section>
                </div>
                <div id="reports-services-print" style={{ display: "none" }}>
                    <ReportsServicesPrint
                        fromDate={fromDate}
                        toDate={toDate}
                        rows={orders}
                    />
                </div>
            </main>
        </div>
    );
}

export default ReportsServicesPage;
