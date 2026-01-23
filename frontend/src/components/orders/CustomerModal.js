import React, { useState, useEffect } from "react";
import { customersAPI } from "../../services/api";

function CustomerModal({ isOpen, onClose, onSelectCustomer }) {
    const [searchMode, setSearchMode] = useState("name");
    const [searchText, setSearchText] = useState("");
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showAddForm, setShowAddForm] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        name: "",
        phone: "",
        phone2: "",
        address: "",
        rnc: "",
    });

    useEffect(() => {
        if (isOpen) {
            fetchCustomers();
        }
    }, [isOpen]);

    async function fetchCustomers(search = "") {
        setLoading(true);
        setError("");
        try {
            const data = await customersAPI.getAll(search);
            setCustomers(data.customers);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleSearch() {
        fetchCustomers(searchText);
    }

    async function handleAddCustomer(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await customersAPI.create(newCustomer);
            setCustomers([data.customer, ...customers]);
            setShowAddForm(false);
            setNewCustomer({ name: "", phone: "", phone2: "", address: "", rnc: "" });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Select Customer</h2>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    {error && <div className="error-message">{error}</div>}

                    {!showAddForm ? (
                        <>
                            <div className="customer-search">
                                <div className="search-filters">
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
                                            checked={searchMode === "code"}
                                            onChange={() => setSearchMode("code")}
                                        />
                                        <span>Code</span>
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

                                <div className="search-input-group">
                                    <input
                                        className="input"
                                        placeholder="Type to search..."
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                    <button className="button-primary" onClick={handleSearch}>
                                        Search
                                    </button>
                                </div>

                                <button
                                    className="button-secondary"
                                    style={{ marginTop: "8px", width: "100%" }}
                                    onClick={() => setShowAddForm(true)}
                                >
                                    + Add New Customer
                                </button>
                            </div>

                            {loading ? (
                                <p className="text-small">Loading...</p>
                            ) : (
                                <div className="customer-list">
                                    {customers.map((customer) => (
                                        <div
                                            key={customer.id}
                                            className="customer-item"
                                            onClick={() => {
                                                onSelectCustomer(customer);
                                                onClose();
                                            }}
                                        >
                                            <div className="customer-item-main">
                                                <strong>{customer.name}</strong>
                                                <span className="text-small">Code: {customer.code}</span>
                                            </div>
                                            <div className="customer-item-details">
                                                <span className="text-small">{customer.phone}</span>
                                                {customer.rnc && (
                                                    <span className="text-small">RNC: {customer.rnc}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {customers.length === 0 && (
                                        <p className="text-small">No customers found.</p>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <form onSubmit={handleAddCustomer} className="add-customer-form">
                            <h3>Add New Customer</h3>

                            <label>
                                Name *
                                <input
                                    className="input"
                                    required
                                    value={newCustomer.name}
                                    onChange={(e) =>
                                        setNewCustomer({ ...newCustomer, name: e.target.value })
                                    }
                                />
                            </label>

                            <label>
                                Phone *
                                <input
                                    className="input"
                                    required
                                    value={newCustomer.phone}
                                    onChange={(e) =>
                                        setNewCustomer({ ...newCustomer, phone: e.target.value })
                                    }
                                />
                            </label>

                            <label>
                                Phone 2
                                <input
                                    className="input"
                                    value={newCustomer.phone2}
                                    onChange={(e) =>
                                        setNewCustomer({ ...newCustomer, phone2: e.target.value })
                                    }
                                />
                            </label>

                            <label>
                                Address
                                <input
                                    className="input"
                                    value={newCustomer.address}
                                    onChange={(e) =>
                                        setNewCustomer({ ...newCustomer, address: e.target.value })
                                    }
                                />
                            </label>

                            <label>
                                RNC
                                <input
                                    className="input"
                                    value={newCustomer.rnc}
                                    onChange={(e) =>
                                        setNewCustomer({ ...newCustomer, rnc: e.target.value })
                                    }
                                />
                            </label>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="button-secondary"
                                    onClick={() => setShowAddForm(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="button-primary" disabled={loading}>
                                    {loading ? "Adding..." : "Add Customer"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CustomerModal;
