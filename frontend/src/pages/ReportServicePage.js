import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { reportsAPI } from "../services/api";



function ReportsServicesPrint({ fromDate, toDate, rows, totals }) {
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
                        <th style={{ padding: "8px 4px", textAlign: "right", borderBottom: "1px solid #000" }}>Subtotal</th>
                        <th style={{ padding: "8px 4px", textAlign: "right", borderBottom: "1px solid #000" }}>ITBIS</th>
                        <th style={{ padding: "8px 4px", textAlign: "right", borderBottom: "1px solid #000" }}>Discount</th>
                        <th style={{ padding: "8px 4px", textAlign: "right", borderBottom: "1px solid #000" }}>Total</th>
                        <th style={{ padding: "8px 4px", textAlign: "right", borderBottom: "1px solid #000" }}>Cash</th>
                        <th style={{ padding: "8px 4px", textAlign: "right", borderBottom: "1px solid #000" }}>Card</th>
                        <th style={{ padding: "8px 4px", textAlign: "right", borderBottom: "1px solid #000" }}>Transfer</th>
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
                            <td style={{ padding: "6px 4px", textAlign: "right" }}>
                                {parseFloat(row.cash || 0).toFixed(2)}
                            </td>
                            <td style={{ padding: "6px 4px", textAlign: "right" }}>
                                {parseFloat(row.card || 0).toFixed(2)}
                            </td>
                            <td style={{ padding: "6px 4px", textAlign: "right" }}>
                                {parseFloat(row.transfer || 0).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals Summary */}
            <div style={{
                marginTop: "30px",
                paddingTop: "15px",
                borderTop: "2px solid #000"
            }}>
                <table style={{
                    width: "300px",
                    marginLeft: "auto",
                    fontSize: "11px"
                }}>
                    <tbody>
                        <tr>
                            <td style={{ padding: "4px 8px", textAlign: "left" }}>
                                <strong>Subtotal</strong>
                            </td>
                            <td style={{ padding: "4px 8px", textAlign: "right" }}>
                                {totals.totalSubtotal.toFixed(2)}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: "4px 8px", textAlign: "left" }}>
                                <strong>ITBIS</strong>
                            </td>
                            <td style={{ padding: "4px 8px", textAlign: "right" }}>
                                {totals.totalTax.toFixed(2)}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: "4px 8px", textAlign: "left" }}>
                                <strong>Discount</strong>
                            </td>
                            <td style={{ padding: "4px 8px", textAlign: "right" }}>
                                {totals.totalDiscount.toFixed(2)}
                            </td>
                        </tr>
                        <tr style={{ borderTop: "1px solid #000" }}>
                            <td style={{ padding: "8px 8px 4px", textAlign: "left" }}>
                                <strong>Total</strong>
                            </td>
                            <td style={{ padding: "8px 8px 4px", textAlign: "right" }}>
                                <strong>{totals.totalAmount.toFixed(2)}</strong>
                            </td>
                        </tr>
                        <tr style={{ borderTop: "1px solid #ddd", marginTop: "8px" }}>
                            <td style={{ padding: "8px 8px 4px", textAlign: "left" }}>Cash</td>
                            <td style={{ padding: "8px 8px 4px", textAlign: "right" }}>
                                {totals.totalCash.toFixed(2)}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: "4px 8px", textAlign: "left" }}>Card</td>
                            <td style={{ padding: "4px 8px", textAlign: "right" }}>
                                {totals.totalCard.toFixed(2)}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: "4px 8px", textAlign: "left" }}>Transfer</td>
                            <td style={{ padding: "4px 8px", textAlign: "right" }}>
                                {totals.totalTransfer.toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

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
    const [summary, setSummary] = useState(null);
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
            setSummary(data.summary);
        } catch (err) {
            setError(err.message || "Failed to fetch report");
        } finally {
            setLoading(false);
        }
    }, [fromDate, toDate]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    const totals = summary || {
        totalSubtotal: 0,
        totalTax: 0,
        totalDiscount: 0,
        totalAmount: 0,
        totalCash: 0,
        totalCard: 0,
        totalTransfer: 0,
    };

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
                                                <th className="text-right">Subtotal</th>
                                                <th className="text-right">ITBIS</th>
                                                <th className="text-right">Discount</th>
                                                <th className="text-right">Total</th>
                                                <th className="text-right">Cash</th>
                                                <th className="text-right">Card</th>
                                                <th className="text-right">Transfer</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((row) => (
                                                <tr key={row.id}>
                                                    <td>{row.code}</td>
                                                    <td>{row.order_date}</td>
                                                    <td>{row.customer_name}</td>
                                                    <td>{row.customer_rnc || "-"}</td>
                                                    <td>{row.ncf_number || "-"}</td>
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
                                                    <td className="text-right">
                                                        {parseFloat(row.cash || 0).toFixed(2)}
                                                    </td>
                                                    <td className="text-right">
                                                        {parseFloat(row.card || 0).toFixed(2)}
                                                    </td>
                                                    <td className="text-right">
                                                        {parseFloat(row.transfer || 0).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                            {orders.length === 0 && (
                                                <tr>
                                                    <td colSpan={12} style={{ textAlign: "center", padding: 16 }}>
                                                        No services found for this period.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="reports-footer">
                                    <div className="reports-totals">
                                        <div className="reports-totals-row">
                                            <span>Subtotal</span>
                                            <span>{totals.totalSubtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="reports-totals-row">
                                            <span>ITBIS</span>
                                            <span>{totals.totalTax.toFixed(2)}</span>
                                        </div>
                                        <div className="reports-totals-row">
                                            <span>Discount</span>
                                            <span>{totals.totalDiscount.toFixed(2)}</span>
                                        </div>
                                        <div className="reports-totals-row">
                                            <span>Total</span>
                                            <span>{totals.totalAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="reports-totals-row">
                                            <span>Cash</span>
                                            <span>{totals.totalCash.toFixed(2)}</span>
                                        </div>
                                        <div className="reports-totals-row">
                                            <span>Card</span>
                                            <span>{totals.totalCard.toFixed(2)}</span>
                                        </div>
                                        <div className="reports-totals-row">
                                            <span>Transfer</span>
                                            <span>{totals.totalTransfer.toFixed(2)}</span>
                                        </div>
                                    </div>

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
                        totals={totals}
                    />
                </div>
            </main>
        </div>
    );
}

export default ReportsServicesPage;
