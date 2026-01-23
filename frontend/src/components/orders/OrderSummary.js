import React from "react";

function OrderSummary({
    selectedCustomer,
    onSelectCustomer,
    orderItems,
    onUpdateItem,
    onRemoveItem,
    subtotal,
    tax,
    discount,
    onDiscountChange,
    total,
    notes,
    onNotesChange,
    onProcess,
    loading,
}) {
    return (
        <div className="order-summary">
            <div className="order-summary-header">
                <h2>Order Summary</h2>
            </div>

            <div className="order-summary-section">
                <label className="order-summary-label">Customer</label>
                {selectedCustomer ? (
                    <div className="selected-customer">
                        <div>
                            <strong>{selectedCustomer.name}</strong>
                            <p className="text-small">{selectedCustomer.phone}</p>
                        </div>
                        <button className="button-link" onClick={onSelectCustomer}>
                            Change
                        </button>
                    </div>
                ) : (
                    <button className="button-secondary" onClick={onSelectCustomer}>
                        Select Customer
                    </button>
                )}
            </div>

            <div className="order-summary-section">
                <label className="order-summary-label">Items</label>
                {orderItems.length === 0 ? (
                    <p className="text-small">No items added yet</p>
                ) : (
                    <div className="order-items-list">
                        {orderItems.map((item, idx) => (
                            <div key={idx} className="order-item-card">
                                <div className="order-item-header">
                                    <strong>
                                        {item.qty}x {item.garment_name}
                                    </strong>
                                    <button
                                        className="button-link"
                                        onClick={() => onRemoveItem(idx)}
                                        style={{ color: "#ef4444" }}
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="order-item-row">
                                    <label className="text-small">
                                        Color
                                        <input
                                            className="input input-sm"
                                            value={item.color}
                                            onChange={(e) => onUpdateItem(idx, "color", e.target.value)}
                                            placeholder="e.g. White"
                                        />
                                    </label>

                                    <label className="text-small">
                                        Qty
                                        <input
                                            type="number"
                                            min="1"
                                            className="input input-sm"
                                            value={item.qty}
                                            onChange={(e) =>
                                                onUpdateItem(idx, "qty", parseInt(e.target.value) || 1)
                                            }
                                        />
                                    </label>
                                </div>

                                <label className="text-small">
                                    Service
                                    <select
                                        className="input input-sm"
                                        value={item.service}
                                        onChange={(e) => onUpdateItem(idx, "service", e.target.value)}
                                    >
                                        <option value="WASH_IRON">Wash & Iron</option>
                                        <option value="IRON_ONLY">Iron Only</option>
                                        <option value="DRY_CLEAN">Dry Clean</option>
                                        <option value="REPAIR">Repair</option>
                                    </select>
                                </label>

                                <label className="order-item-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={item.is_express === "YES"}
                                        onChange={(e) =>
                                            onUpdateItem(idx, "is_express", e.target.checked ? "YES" : "NO")
                                        }
                                    />
                                    <span className="text-small">Express Service (+20%)</span>
                                </label>

                                <div className="order-item-price">
                                    ${(item.qty * item.price).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="order-summary-section">
                <label className="order-summary-label">Notes</label>
                <textarea
                    className="input"
                    rows="2"
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Add any special instructions..."
                />
            </div>

            <div className="order-totals">
                <div className="order-totals-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="order-totals-row">
                    <span>Tax (18%)</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <div className="order-totals-row">
                    <span>Discount</span>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="input input-sm"
                        style={{ width: "80px", textAlign: "right" }}
                        value={discount}
                        onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div className="order-totals-row order-totals-total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            <button
                className="button-primary order-process-button"
                onClick={onProcess}
                disabled={loading || !selectedCustomer || orderItems.length === 0}
            >
                {loading ? "Processing..." : "Process Order"}
            </button>
        </div>
    );
}

export default OrderSummary;
