import React from "react";

function InvoicePrint({ orderNumber, date, customer, items, subtotal, tax, total, advance, balance, estimatedDate }) {
    const totalGarments = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <div className="invoice-root">
            <div className="invoice-header">
                <div className="invoice-title">ESOFT LAUNDRY</div>
                <div>Quality & Punctuality</div>
                <div>123 Main Street, City Center</div>
                <div>Open Mon–Sat 8:00 AM – 6:00 PM</div>
            </div>

            <div className="invoice-section invoice-section--center">
                <div className="invoice-subtitle">WORK ORDER</div>
                <div className="invoice-row">
                    <span>No. {orderNumber || "000001"}</span>
                    <span>Date: {date}</span>
                </div>
                <div className="invoice-row">
                    <span>Client:</span>
                    <span className="invoice-value">
                        {customer ? customer.name : "Walk‑in customer"}
                    </span>
                </div>
                {customer?.phone && (
                    <div className="invoice-row">
                        <span>Phone:</span>
                        <span className="invoice-value">{customer.phone}</span>
                    </div>
                )}
            </div>

            <div className="invoice-section">
                <div className="invoice-row invoice-row--bold">
                    <span>DETAILS</span>
                    <span>PRICE</span>
                    <span>TOTAL</span>
                </div>

                {items.map((item, index) => (
                    <div key={item.id} className="invoice-row">
                        <div className="invoice-details">
                            {index + 1}- {item.name} - {item.color || "No color"}
                            {item.note ? ` (${item.note})` : ""}
                        </div>
                        <span>{parseFloat(item.price || 0).toFixed(2)}</span>
                        <span>{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}

                <div className="invoice-row" style={{ marginTop: 8 }}>
                    <span>Total garments:</span>
                    <span className="invoice-value">{totalGarments}</span>
                </div>
            </div>

            <div className="invoice-section">
                <div className="invoice-row">
                    <span>SUBTOTAL:</span>
                    <span>{subtotal.toFixed(2)}</span>
                </div>
                <div className="invoice-row">
                    <span>TAX (ITBIS):</span>
                    <span>{tax.toFixed(2)}</span>
                </div>
                <div className="invoice-row">
                    <span>DISCOUNT:</span>
                    <span>0.00</span>
                </div>
                <div className="invoice-row invoice-row--bold">
                    <span>Total:</span>
                    <span>{total.toFixed(2)}</span>
                </div>
                <div className="invoice-row">
                    <span>Advance:</span>
                    <span>{advance.toFixed(2)}</span>
                </div>
                <div className="invoice-row">
                    <span>Balance:</span>
                    <span>{balance.toFixed(2)}</span>
                </div>

                <div className="invoice-row invoice-row--center" style={{ marginTop: 8 }}>
                    <span>Estimated delivery</span>
                </div>
                <div className="invoice-row invoice-row--center">
                    <span>{estimatedDate}</span>
                </div>
            </div>

            <div className="invoice-footer">
                <div>We are not responsible if your clothes fade or shrink.</div>
                <div>We are not responsible for garments left over 90 days.</div>
                <div className="invoice-row--center" style={{ marginTop: 6 }}>
                    <strong>Come back soon!</strong>
                </div>
            </div>
        </div>
    );
}

export default InvoicePrint;
