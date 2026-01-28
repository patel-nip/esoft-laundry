import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import CustomerModal from "../components/orders/CustomerModal";
import InvoicePrint from "../components/orders/InvoicePrint";
import { ordersAPI, servicePricesAPI } from "../services/api";

const GARMENT_CATEGORIES = {
    Clothing: ["Shirt", "Polo", "Blouse", "Jeans", "Pants", "Dress"],
    Home: ["Curtain", "Tablecloth", "Sheet", "Small quilt", "Medium quilt", "Large quilt"],
    Accessories: ["Cap", "Tie", "Vest", "Scarf", "Other"],
};

const SERVICE_OPTIONS = [
    { label: "Wash & iron", value: "Wash & Iron", dbColumn: "wash_iron" },
    { label: "Wash & iron white", value: "Wash & Iron White", dbColumn: "wash_iron_white" },
    { label: "Iron only", value: "Iron Only", dbColumn: "iron_only" },
    { label: "Alterations", value: "Alterations", dbColumn: "alterations" },
];

const COLOR_OPTIONS = [
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#ef4444" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#22c55e" },
    { name: "Yellow", value: "#eab308" },
    { name: "Orange", value: "#f97316" },
    { name: "Purple", value: "#a855f7" },
    { name: "Brown", value: "#92400e" },
    { name: "Gray", value: "#6b7280" },
];

function CreateOrderPage() {
    const [customerModalOpen, setCustomerModalOpen] = useState(false);
    const [customer, setCustomer] = useState(null);
    const [items, setItems] = useState([]);
    const [orderNote, setOrderNote] = useState("");
    const [openColorItemId, setOpenColorItemId] = useState(null);
    const [tempCustomColor, setTempCustomColor] = useState(null);
    const [openServiceItemId, setOpenServiceItemId] = useState(null);
    const [tempCustomService, setTempCustomService] = useState("");
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [printChoiceModalOpen, setPrintChoiceModalOpen] = useState(false);
    const [payment, setPayment] = useState({
        cash: 0,
        card: 0,
        transfer: 0,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [createdOrder, setCreatedOrder] = useState(null);
    const [servicePrices, setServicePrices] = useState([]);

    useEffect(() => {
        fetchServicePrices();
    }, []);

    async function fetchServicePrices() {
        try {
            const data = await servicePricesAPI.getAll();
            console.log("📦 Service Prices loaded:", data.servicePrices);
            setServicePrices(data.servicePrices || []);
        } catch (err) {
            console.error("Failed to fetch service prices:", err);
        }
    }

    function calculatePrice(garmentName, serviceName, isExpress) {
        const priceRow = servicePrices.find(p => p.garment_name === garmentName);

        if (!priceRow) {
            console.log(`❌ No price found for garment: ${garmentName}`);
            return 0;
        }

        let basePrice = 0;

        const serviceOption = SERVICE_OPTIONS.find(s => s.value === serviceName);
        const dbColumn = serviceOption ? serviceOption.dbColumn : null;

        if (dbColumn && priceRow[dbColumn]) {
            basePrice = parseFloat(priceRow[dbColumn]);
        } else {
            console.log(`❌ No price found for service: ${serviceName} (column: ${dbColumn})`);
        }

        if (isExpress && basePrice > 0) {
            const expressPercent = priceRow.express_percent ? parseFloat(priceRow.express_percent) / 100 : 0.20;
            basePrice = basePrice * (1 + expressPercent);
        }

        console.log(`💰 Price calculated: ${garmentName} + ${serviceName} + Express(${isExpress}) = ${basePrice}`);
        return basePrice;
    }

    function addItem(name) {
        const defaultService = "Wash & Iron";
        const price = calculatePrice(name, defaultService, false);

        setItems((prev) => [
            ...prev,
            {
                id: prev.length + 1,
                name,
                color: "",
                service: defaultService,
                price: price,
                quantity: 1,
                express: false,
                note: "",
            },
        ]);
    }

    function getColorValue(colorNameOrHex) {
        if (!colorNameOrHex) return "#111827";
        const predefined = COLOR_OPTIONS.find((c) => c.name === colorNameOrHex);
        return predefined ? predefined.value : colorNameOrHex;
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;
    const amountPaid = payment.cash + payment.card + payment.transfer;
    const remaining = Math.max(0, total - amountPaid);
    const change = Math.max(0, amountPaid - total);

    async function handleProcessPayment() {
        if (!customer) {
            setError("Please select a customer");
            return;
        }

        if (items.length === 0) {
            setError("Please add at least one item");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const orderItems = items.map(item => ({
                qty: item.quantity,
                garment_name: item.name,
                color: item.color || null,
                service: item.service,
                is_express: item.express ? "YES" : "NO",
                price: item.price,
                note: item.note || null,
            }));

            const orderData = {
                customer_id: customer.id,
                items: orderItems,
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
                discount: 0,
                total: total.toFixed(2),
                paid: amountPaid.toFixed(2),
                notes: orderNote || null,
                eta_days: 3,
            };

            const response = await ordersAPI.create(orderData);

            setCreatedOrder(response.order);
            setSuccess(`Order ${response.order.code} created successfully!`);

            setPaymentModalOpen(false);
            setPrintChoiceModalOpen(true);

        } catch (err) {
            setError(err.message || "Failed to create order");
            setLoading(false);
        }
    }

    const printInvoice = () => {
        const printContents = document.getElementById("print-area").innerHTML;
        const win = window.open("", "_blank");
        win.document.write(`
    <html>
      <head>
        <title>Invoice</title>
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

        setTimeout(() => {
            setItems([]);
            setCustomer(null);
            setOrderNote("");
            setPayment({ cash: 0, card: 0, transfer: 0 });
            setSuccess("");
            setCreatedOrder(null);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="dashboard-main">
                <Header />
                <div className="dashboard-content">
                    <section className="order-left">
                        {Object.entries(GARMENT_CATEGORIES).map(([category, list]) => (
                            <div key={category} style={{ marginBottom: 16 }}>
                                <div className="category-title">{category}</div>
                                <div className="item-grid">
                                    {list.map((name) => (
                                        <button
                                            key={name}
                                            className="item-button"
                                            onClick={() => addItem(name)}
                                        >
                                            <div className="item-icon" />
                                            <span>{name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="order-right">
                        <header
                            style={{
                                borderBottom: "1px solid #1f2937",
                                padding: "12px 20px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                fontSize: 12,
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                <div style={{ flex: 1 }}>
                                    <div className="text-small" style={{ marginBottom: 4, color: "#9ca3af" }}>
                                        Customer Information
                                    </div>
                                    {customer ? (
                                        <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                                            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                                                {customer.name}
                                            </div>
                                            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                                                {customer.phone && (
                                                    <div>
                                                        <span style={{ color: "#9ca3af" }}>Phone: </span>
                                                        <span>{customer.phone}</span>
                                                    </div>
                                                )}
                                                {customer.phone2 && (
                                                    <div>
                                                        <span style={{ color: "#9ca3af" }}>Phone 2: </span>
                                                        <span>{customer.phone2}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {customer.address && (
                                                <div style={{ marginTop: 2 }}>
                                                    <span style={{ color: "#9ca3af" }}>Address: </span>
                                                    <span>{customer.address}</span>
                                                </div>
                                            )}
                                            <div style={{ display: "flex", gap: 16, marginTop: 2 }}>
                                                {customer.rnc && (
                                                    <div>
                                                        <span style={{ color: "#9ca3af" }}>RNC: </span>
                                                        <span>{customer.rnc}</span>
                                                    </div>
                                                )}
                                                {customer.email && (
                                                    <div>
                                                        <span style={{ color: "#9ca3af" }}>Email: </span>
                                                        <span>{customer.email}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: 13, fontWeight: 500, color: "#6b7280" }}>
                                            No customer selected
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setCustomerModalOpen(true)}
                                        style={{
                                            marginTop: 8,
                                            borderRadius: 6,
                                            border: "1px solid #0ea5e9",
                                            padding: "4px 12px",
                                            background: "transparent",
                                            color: "#7dd3fc",
                                            fontSize: 11,
                                            cursor: "pointer",
                                        }}
                                    >
                                        {customer ? "Change customer" : "Search customer"}
                                    </button>
                                </div>
                            </div>

                            <div style={{ textAlign: "right", minWidth: 150 }}>
                                <div style={{ fontSize: 13, fontWeight: 500 }}>
                                    {createdOrder ? `Receipt No. ${createdOrder.code}` : "New Order"}
                                </div>
                                <div className="text-small" style={{ color: "#9ca3af", marginTop: 2 }}>
                                    {new Date().toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        </header>

                        {error && (
                            <div style={{ padding: "12px 20px", background: "#991b1b", color: "#fecaca" }}>
                                {error}
                            </div>
                        )}
                        {success && (
                            <div style={{ padding: "12px 20px", background: "#065f46", color: "#6ee7b7" }}>
                                {success}
                            </div>
                        )}

                        <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px" }}>
                            <table className="order-table">
                                <thead style={{ color: "#9ca3af" }}>
                                    <tr>
                                        <th style={{ textAlign: "left" }}>Qty</th>
                                        <th style={{ textAlign: "left" }}>Item</th>
                                        <th style={{ textAlign: "left" }}>Color</th>
                                        <th style={{ textAlign: "left" }}>Service</th>
                                        <th style={{ textAlign: "right" }}>Price</th>
                                        <th style={{ textAlign: "right" }}>Total</th>
                                        <th style={{ textAlign: "center" }}>Express</th>
                                        <th style={{ textAlign: "left" }}>Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="qty-control">
                                                    <button
                                                        type="button"
                                                        className="qty-btn"
                                                        onClick={() =>
                                                            setItems((prev) =>
                                                                prev
                                                                    .map((i) =>
                                                                        i.id === item.id
                                                                            ? { ...i, quantity: i.quantity - 1 }
                                                                            : i
                                                                    )
                                                                    .filter((i) => i.quantity > 0)
                                                            )
                                                        }
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        className="qty-input"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            setItems((prev) =>
                                                                prev.map((i) =>
                                                                    i.id === item.id
                                                                        ? {
                                                                            ...i,
                                                                            quantity: Math.max(
                                                                                1,
                                                                                Number(e.target.value) || 1
                                                                            ),
                                                                        }
                                                                        : i
                                                                )
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        type="button"
                                                        className="qty-btn"
                                                        onClick={() =>
                                                            setItems((prev) =>
                                                                prev.map((i) =>
                                                                    i.id === item.id
                                                                        ? { ...i, quantity: i.quantity + 1 }
                                                                        : i
                                                                )
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>

                                            <td>{item.name}</td>
                                            <td>
                                                <div className="color-cell">
                                                    <button
                                                        type="button"
                                                        className="color-trigger"
                                                        onClick={() =>
                                                            setOpenColorItemId(
                                                                openColorItemId === item.id ? null : item.id
                                                            )
                                                        }
                                                    >
                                                        <span
                                                            className="color-preview"
                                                            style={{ backgroundColor: getColorValue(item.color) }}
                                                        />
                                                        <span className="color-label">
                                                            {item.color || "Select color"}
                                                        </span>
                                                    </button>

                                                    {openColorItemId === item.id && (
                                                        <div className="color-popover">
                                                            {COLOR_OPTIONS.map((c) => (
                                                                <button
                                                                    key={c.name}
                                                                    type="button"
                                                                    className="color-option"
                                                                    onClick={() => {
                                                                        setItems((prev) =>
                                                                            prev.map((i) =>
                                                                                i.id === item.id ? { ...i, color: c.name } : i
                                                                            )
                                                                        );
                                                                        setOpenColorItemId(null);
                                                                    }}
                                                                >
                                                                    <span
                                                                        className="color-option-swatch"
                                                                        style={{ backgroundColor: c.value }}
                                                                    />
                                                                    <span className="color-option-name">{c.name}</span>
                                                                </button>
                                                            ))}

                                                            <label className="color-option custom-color-option">
                                                                <span className="color-option-swatch custom-swatch">+</span>
                                                                <span className="color-option-name">Custom color</span>

                                                                <input
                                                                    type="color"
                                                                    className="hidden-color-input"
                                                                    onInput={(e) => {
                                                                        setTempCustomColor(e.target.value);
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        const hex = tempCustomColor || e.target.value;
                                                                        setItems((prev) =>
                                                                            prev.map((i) =>
                                                                                i.id === item.id ? { ...i, color: hex } : i
                                                                            )
                                                                        );
                                                                        setTempCustomColor(null);
                                                                        setOpenColorItemId(null);
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td>
                                                <div className="service-cell">
                                                    <button
                                                        type="button"
                                                        className="service-trigger"
                                                        onClick={() =>
                                                            setOpenServiceItemId(
                                                                openServiceItemId === item.id ? null : item.id
                                                            )
                                                        }
                                                    >
                                                        <span className="service-label">
                                                            {item.service || "Select service"}
                                                        </span>
                                                    </button>

                                                    {openServiceItemId === item.id && (
                                                        <div className="service-popover">
                                                            {SERVICE_OPTIONS.map((s) => (
                                                                <button
                                                                    key={s.value}
                                                                    type="button"
                                                                    className="service-option"
                                                                    onClick={() => {
                                                                        const newPrice = calculatePrice(item.name, s.value, item.express);
                                                                        setItems((prev) =>
                                                                            prev.map((i) =>
                                                                                i.id === item.id
                                                                                    ? { ...i, service: s.value, price: newPrice }
                                                                                    : i
                                                                            )
                                                                        );
                                                                        setOpenServiceItemId(null);
                                                                    }}
                                                                >
                                                                    {s.label}
                                                                </button>
                                                            ))}

                                                            <div className="service-option custom-service-option">
                                                                <span className="custom-service-label">Custom service</span>
                                                                <input
                                                                    type="text"
                                                                    className="custom-service-input"
                                                                    placeholder="Type & press Enter"
                                                                    value={tempCustomService}
                                                                    onChange={(e) => setTempCustomService(e.target.value)}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === "Enter" && tempCustomService.trim()) {
                                                                            const value = tempCustomService.trim();
                                                                            setItems((prev) =>
                                                                                prev.map((i) =>
                                                                                    i.id === item.id ? { ...i, service: value } : i
                                                                                )
                                                                            );
                                                                            setTempCustomService("");
                                                                            setOpenServiceItemId(null);
                                                                        }
                                                                    }}
                                                                    onBlur={() => {
                                                                        if (tempCustomService.trim()) {
                                                                            const value = tempCustomService.trim();
                                                                            setItems((prev) =>
                                                                                prev.map((i) =>
                                                                                    i.id === item.id ? { ...i, service: value } : i
                                                                                )
                                                                            );
                                                                        }
                                                                        setTempCustomService("");
                                                                        setOpenServiceItemId(null);
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td style={{ textAlign: "right" }}>
                                                <input
                                                    type="number"
                                                    className="input"
                                                    style={{ width: 90, fontSize: 11, textAlign: "right" }}
                                                    value={item.price}
                                                    onChange={(e) =>
                                                        setItems((prev) =>
                                                            prev.map((i) =>
                                                                i.id === item.id
                                                                    ? { ...i, price: Number(e.target.value) }
                                                                    : i
                                                            )
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                                {(item.price * item.quantity).toFixed(2)}
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <input
                                                    type="checkbox"
                                                    checked={item.express}
                                                    onChange={(e) => {
                                                        const isExpress = e.target.checked;
                                                        const newPrice = calculatePrice(item.name, item.service, isExpress);
                                                        setItems((prev) =>
                                                            prev.map((i) =>
                                                                i.id === item.id
                                                                    ? { ...i, express: isExpress, price: newPrice }
                                                                    : i
                                                            )
                                                        );
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    className="input"
                                                    style={{ fontSize: 11 }}
                                                    value={item.note}
                                                    onChange={(e) =>
                                                        setItems((prev) =>
                                                            prev.map((i) =>
                                                                i.id === item.id
                                                                    ? { ...i, note: e.target.value }
                                                                    : i
                                                            )
                                                        )
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <footer
                            style={{
                                borderTop: "1px solid #1f2937",
                                padding: "10px 20px",
                                display: "flex",
                                gap: 16,
                                alignItems: "flex-start",
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div className="text-small" style={{ marginBottom: 4 }}>
                                    Order note
                                </div>
                                <textarea
                                    rows={2}
                                    className="input"
                                    style={{ resize: "vertical", fontSize: 12 }}
                                    placeholder="Write a note for this order..."
                                    value={orderNote}
                                    onChange={(e) => setOrderNote(e.target.value)}
                                />
                            </div>

                            <div style={{ width: 260, fontSize: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>Sub‑total</span>
                                    <span>{subtotal.toFixed(2)}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>Tax (ITBIS 18%)</span>
                                    <span>{tax.toFixed(2)}</span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginTop: 4,
                                        color: "#22c55e",
                                        fontWeight: 600,
                                    }}
                                >
                                    <span>Total</span>
                                    <span>{total.toFixed(2)}</span>
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: 8,
                                        marginTop: 8,
                                    }}
                                >
                                    <button
                                        className="button-primary"
                                        type="button"
                                        onClick={() => setPaymentModalOpen(true)}
                                        disabled={!customer || items.length === 0}
                                    >
                                        Process order
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setItems([])}
                                        style={{
                                            flex: 1,
                                            padding: "10px 14px",
                                            borderRadius: 8,
                                            border: "1px solid #4b5563",
                                            background: "transparent",
                                            color: "#e5e7eb",
                                            fontSize: 12,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </section>
                </div>
            </main>

            <CustomerModal
                isOpen={customerModalOpen}
                onClose={() => setCustomerModalOpen(false)}
                onSelectCustomer={setCustomer}
            />

            {paymentModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal payment-modal">
                        <button
                            type="button"
                            className="modal-close"
                            onClick={() => setPaymentModalOpen(false)}
                        >
                            ×
                        </button>

                        <div className="payment-total">
                            Total: {total.toFixed(2)} | Remaining: {remaining.toFixed(2)}
                        </div>

                        <div className="payment-row">
                            <label>Cash</label>
                            <input
                                type="number"
                                value={payment.cash}
                                onChange={(e) =>
                                    setPayment((p) => ({ ...p, cash: Number(e.target.value) || 0 }))
                                }
                            />
                        </div>

                        <div className="payment-row">
                            <label>Card</label>
                            <input
                                type="number"
                                value={payment.card}
                                onChange={(e) =>
                                    setPayment((p) => ({ ...p, card: Number(e.target.value) || 0 }))
                                }
                            />
                        </div>

                        <div className="payment-row">
                            <label>Transfer</label>
                            <input
                                type="number"
                                value={payment.transfer}
                                onChange={(e) =>
                                    setPayment((p) => ({ ...p, transfer: Number(e.target.value) || 0 }))
                                }
                            />
                        </div>

                        <div className="payment-row">
                            <label>Change</label>
                            <input
                                type="number"
                                readOnly
                                value={change.toFixed(2)}
                            />
                        </div>

                        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                            <button
                                className="button-primary"
                                type="button"
                                onClick={handleProcessPayment}
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Process"}
                            </button>

                            <button
                                type="button"
                                className="button-secondary"
                                onClick={() => setPaymentModalOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {printChoiceModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal print-choice-modal">
                        <button
                            type="button"
                            className="modal-close"
                            onClick={() => setPrintChoiceModalOpen(false)}
                        >
                            ×
                        </button>

                        <h3 style={{ marginBottom: 12 }}>Print Work Order</h3>
                        <div className="print-choice-grid">
                            <button
                                type="button"
                                className="print-choice-btn"
                                onClick={() => {
                                    printInvoice();
                                    setPrintChoiceModalOpen(false);
                                }}
                            >
                                View on screen
                            </button>

                            <button
                                type="button"
                                className="print-choice-btn"
                                onClick={() => {
                                    printInvoice();
                                    setPrintChoiceModalOpen(false);
                                }}
                            >
                                Print directly
                            </button>
                        </div>

                        <button
                            type="button"
                            className="button-secondary"
                            style={{ marginTop: 10, width: "100%" }}
                            onClick={() => setPrintChoiceModalOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div id="print-area" style={{ display: "none" }}>
                <InvoicePrint
                    orderNumber={createdOrder?.code || "N/A"}
                    date={createdOrder?.order_date || new Date().toLocaleDateString()}
                    customer={customer}
                    items={items}
                    subtotal={subtotal}
                    tax={tax}
                    total={total}
                    advance={amountPaid}
                    balance={remaining}
                    estimatedDate={createdOrder?.eta_date || "N/A"}
                    orderNote={orderNote}
                />
            </div>
        </div>
    );
}

export default CreateOrderPage;
