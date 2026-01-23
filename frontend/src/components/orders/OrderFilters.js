// src/components/orders/OrderFilters.js
import React from "react";

function OrderFilters({
    searchMode,
    setSearchMode,
    searchText,
    setSearchText,
}) {
    return (
        <div className="order-filters">
            <div className="order-filters-left">
                <span className="order-filters-label">Search by:</span>
                <label className="order-filters-radio">
                    <input
                        type="radio"
                        checked={searchMode === "code"}
                        onChange={() => setSearchMode("code")}
                    />
                    <span>Order code</span>
                </label>
                <label className="order-filters-radio">
                    <input
                        type="radio"
                        checked={searchMode === "name"}
                        onChange={() => setSearchMode("name")}
                    />
                    <span>Name</span>
                </label>
                <label className="order-filters-radio">
                    <input
                        type="radio"
                        checked={searchMode === "phone"}
                        onChange={() => setSearchMode("phone")}
                    />
                    <span>Phone</span>
                </label>
            </div>
            <div className="order-filters-right">
                <input
                    className="input order-filters-input"
                    placeholder="Type to search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>
        </div>
    );
}

export default OrderFilters;
