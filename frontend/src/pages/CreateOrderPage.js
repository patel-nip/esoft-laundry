import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import CustomerModal from "../components/orders/CustomerModal";
import InvoicePrint from "../components/orders/InvoicePrint";
import { ordersAPI } from "../services/api";

const GARMENT_CATEGORIES = {
    Clothing: ["Shirt", "Polo", "Blouse", "Jeans", "Pants", "Dress"],
    Home: ["Curtain", "Tablecloth", "Sheet", "Small quilt", "Medium quilt", "Large quilt"],
    Accessories: ["Cap", "Tie", "Vest", "Scarf", "Other"],
};

const SERVICE_OPTIONS = [
    { label: "Wash & iron", value: "Wash & iron" },
    { label: "Iron only", value: "Iron only" },
    { label: "Wash only", value: "Wash only" },
    { label: "Alterations - hem", value: "Alteration: Hem" },
    { label: "Alterations - repair", value: "Alteration: Repair" },
    { label: "Alterations - resize", value: "Alteration: Resize" },
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

    // Backend integration states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [createdOrder, setCreatedOrder] = useState(null);

    function addItem(name) {
        setItems((prev) => [
            ...prev,
            {
                id: prev.length + 1,
                name,
                color: "",
                service: "Wash & iron",
                price: 0,
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

    // Process order - connect to backend
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
            // Transform items to backend format
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

            // Close payment modal and show print choice
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

        // Reset form after printing
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
                                padding: "10px 20px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontSize: 12,
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div>
                                    <div className="text-small" style={{ marginBottom: 2 }}>
                                        Customer
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: 500 }}>
                                        {customer ? customer.name : "Select customer"}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setCustomerModalOpen(true)}
                                    style={{
                                        borderRadius: 8,
                                        border: "1px solid #0ea5e9",
                                        padding: "4px 10px",
                                        background: "transparent",
                                        color: "#7dd3fc",
                                        fontSize: 11,
                                        cursor: "pointer",
                                    }}
                                >
                                    Search customer
                                </button>
                            </div>

                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 12 }}>
                                    {createdOrder ? `Receipt No. ${createdOrder.code}` : "New Order"}
                                </div>
                                <div className="text-small">
                                    {new Date().toLocaleDateString()}
                                </div>
                            </div>
                        </header>

                        {/* Show error/success messages */}
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
                                                                        setItems((prev) =>
                                                                            prev.map((i) =>
                                                                                i.id === item.id ? { ...i, service: s.value } : i
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
                                                    onChange={(e) =>
                                                        setItems((prev) =>
                                                            prev.map((i) =>
                                                                i.id === item.id
                                                                    ? { ...i, express: e.target.checked }
                                                                    : i
                                                            )
                                                        )
                                                    }
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

            {/* Payment Modal */}
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

            {/* Print Choice Modal */}
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
                />
            </div>
        </div>
    );
}

export default CreateOrderPage;
