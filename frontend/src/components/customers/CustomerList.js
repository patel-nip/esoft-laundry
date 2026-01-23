import React from "react";

function CustomerList({
    customers,
    searchMode,
    setSearchMode,
    searchText,
    setSearchText,
    selectedCustomerId,
    onSelectCustomer,
}) {
    return (
        <div className="customers-list">
            <div className="order-filters">
                <div className="order-filters-left">
                    <span className="order-filters-label">Search by:</span>
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

            <div className="customers-table-wrapper">
                <table className="order-table customers-table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Phone 2</th>
                            <th>Address</th>
                            <th>RNC</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((c) => {
                            const selected = c.id === selectedCustomerId;
                            return (
                                <tr
                                    key={c.id}
                                    className={
                                        selected ? "order-row order-row-selected" : "order-row"
                                    }
                                    onClick={() => onSelectCustomer(c.id)}
                                >
                                    <td>{c.code}</td>
                                    <td>{c.name}</td>
                                    <td>{c.phone}</td>
                                    <td>{c.phone2 || "-"}</td>
                                    <td>{c.address || "-"}</td>
                                    <td>{c.rnc || "-"}</td>
                                </tr>
                            );
                        })}
                        {customers.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: "center", padding: 16 }}>
                                    No customers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CustomerList;
