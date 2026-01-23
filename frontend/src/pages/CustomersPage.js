import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import CustomerList from "../components/customers/CustomerList";
import CustomerOrdersPanel from "../components/customers/CustomerOrdersPanel";
import { customersAPI, reportsAPI } from "../services/api";

function CustomersPage() {
    const [searchMode, setSearchMode] = useState("name");
    const [searchText, setSearchText] = useState("");
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [customerOrders, setCustomerOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [newCustomerModalOpen, setNewCustomerModalOpen] = useState(false);
    const [editCustomerModalOpen, setEditCustomerModalOpen] = useState(false);
    const [viewCustomerModalOpen, setViewCustomerModalOpen] = useState(false);

    const emptyCustomer = {
        id: null,
        code: "",
        name: "",
        phone: "",
        phone2: "",
        address: "",
        rnc: "",
    };
    const [formCustomer, setFormCustomer] = useState(emptyCustomer);

    // Fetch customers on mount
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Fetch orders when selected customer changes
    useEffect(() => {
        if (selectedCustomerId) {
            fetchCustomerOrders(selectedCustomerId);
        }
    }, [selectedCustomerId]);

    async function fetchCustomers() {
        setLoading(true);
        setError("");
        try {
            const data = await customersAPI.getAll();
            setCustomers(data.customers);

            // Auto-select first customer
            if (data.customers.length > 0 && !selectedCustomerId) {
                setSelectedCustomerId(data.customers[0].id);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function fetchCustomerOrders(customerId) {
        try {
            const data = await reportsAPI.getCustomerReport(customerId);
            setCustomerOrders(data.orders || []);
        } catch (err) {
            console.error("Failed to fetch customer orders:", err);
            setCustomerOrders([]);
        }
    }

    async function handleSaveCustomer() {
        if (!formCustomer.name.trim() || !formCustomer.phone.trim()) {
            alert("Name and phone are required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            if (editCustomerModalOpen && formCustomer.id) {
                // Update existing customer
                await customersAPI.update(formCustomer.id, {
                    name: formCustomer.name,
                    phone: formCustomer.phone,
                    phone2: formCustomer.phone2,
                    address: formCustomer.address,
                    rnc: formCustomer.rnc,
                });
            } else {
                // Create new customer
                await customersAPI.create({
                    name: formCustomer.name,
                    phone: formCustomer.phone,
                    phone2: formCustomer.phone2,
                    address: formCustomer.address,
                    rnc: formCustomer.rnc,
                });
            }

            // Refresh list
            await fetchCustomers();

            setNewCustomerModalOpen(false);
            setEditCustomerModalOpen(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteCustomer(customerId) {
        if (!window.confirm("Are you sure you want to delete this customer?")) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            await customersAPI.delete(customerId);
            await fetchCustomers();

            // Clear selection if deleted customer was selected
            if (selectedCustomerId === customerId) {
                setSelectedCustomerId(customers[0]?.id || null);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const filteredCustomers = useMemo(() => {
        return customers.filter((c) => {
            if (!searchText.trim()) return true;
            const field = searchMode === "name" ? c.name : c.phone;
            return field.toLowerCase().includes(searchText.toLowerCase());
        });
    }, [customers, searchText, searchMode]);

    const selectedCustomer =
        filteredCustomers.find((c) => c.id === selectedCustomerId) ??
        filteredCustomers[0] ??
        null;

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="dashboard-main">
                <Header />
                <div className="dashboard-content customers-layout">
                    <section className="customers-main">
                        <div className="customers-header-bar">
                            <h1 className="customers-title">Customers &amp; Tax IDs</h1>
                            <div className="customers-actions">
                                <button
                                    className="customers-action-button"
                                    type="button"
                                    onClick={() => {
                                        setFormCustomer(emptyCustomer);
                                        setNewCustomerModalOpen(true);
                                    }}
                                >
                                    New customer
                                </button>

                                <button
                                    className="customers-action-button-secondary"
                                    type="button"
                                    disabled={!selectedCustomer}
                                    onClick={() => {
                                        if (!selectedCustomer) return;
                                        setFormCustomer(selectedCustomer);
                                        setEditCustomerModalOpen(true);
                                    }}
                                >
                                    Edit customer
                                </button>

                                <button
                                    className="customers-action-button-secondary"
                                    type="button"
                                    disabled={!selectedCustomer}
                                    onClick={() => {
                                        if (!selectedCustomer) return;
                                        setViewCustomerModalOpen(true);
                                    }}
                                >
                                    View customer
                                </button>

                                <button
                                    className="customers-action-button-secondary"
                                    type="button"
                                    disabled={!selectedCustomer}
                                    style={{ borderColor: "#ef4444", color: "#ef4444" }}
                                    onClick={() => {
                                        if (selectedCustomer) {
                                            handleDeleteCustomer(selectedCustomer.id);
                                        }
                                    }}
                                >
                                    Delete customer
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div style={{ padding: "12px 20px", background: "#991b1b", color: "#fecaca" }}>
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div style={{ padding: 20, textAlign: "center" }}>Loading...</div>
                        ) : (
                            <CustomerList
                                customers={filteredCustomers}
                                searchMode={searchMode}
                                setSearchMode={setSearchMode}
                                searchText={searchText}
                                setSearchText={setSearchText}
                                selectedCustomerId={selectedCustomer?.id ?? null}
                                onSelectCustomer={setSelectedCustomerId}
                            />
                        )}
                    </section>

                    <aside className="customers-sidebar">
                        <CustomerOrdersPanel
                            customer={selectedCustomer}
                            orders={customerOrders}
                        />
                    </aside>
                </div>

                {/* New / Edit customer modal */}
                {(newCustomerModalOpen || editCustomerModalOpen) && (
                    <div className="modal-backdrop">
                        <div className="modal" style={{ minWidth: 380 }}>
                            <button
                                type="button"
                                className="modal-close"
                                onClick={() => {
                                    setNewCustomerModalOpen(false);
                                    setEditCustomerModalOpen(false);
                                }}
                            >
                                ×
                            </button>

                            <h2 style={{ marginBottom: 12, fontSize: 16 }}>
                                {newCustomerModalOpen ? "New customer" : "Edit customer"}
                            </h2>

                            <div className="form-grid">
                                <label>
                                    <span>Name *</span>
                                    <input
                                        className="input"
                                        value={formCustomer.name}
                                        onChange={(e) =>
                                            setFormCustomer((c) => ({ ...c, name: e.target.value }))
                                        }
                                    />
                                </label>

                                <label>
                                    <span>Phone *</span>
                                    <input
                                        className="input"
                                        value={formCustomer.phone}
                                        onChange={(e) =>
                                            setFormCustomer((c) => ({ ...c, phone: e.target.value }))
                                        }
                                    />
                                </label>

                                <label>
                                    <span>Phone 2</span>
                                    <input
                                        className="input"
                                        value={formCustomer.phone2}
                                        onChange={(e) =>
                                            setFormCustomer((c) => ({ ...c, phone2: e.target.value }))
                                        }
                                    />
                                </label>

                                <label>
                                    <span>Address</span>
                                    <input
                                        className="input"
                                        value={formCustomer.address}
                                        onChange={(e) =>
                                            setFormCustomer((c) => ({ ...c, address: e.target.value }))
                                        }
                                    />
                                </label>

                                <label>
                                    <span>Tax ID (RNC)</span>
                                    <input
                                        className="input"
                                        value={formCustomer.rnc}
                                        onChange={(e) =>
                                            setFormCustomer((c) => ({ ...c, rnc: e.target.value }))
                                        }
                                    />
                                </label>
                            </div>

                            <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" }}>
                                <button
                                    type="button"
                                    className="button-secondary"
                                    onClick={() => {
                                        setNewCustomerModalOpen(false);
                                        setEditCustomerModalOpen(false);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="button-primary"
                                    onClick={handleSaveCustomer}
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {viewCustomerModalOpen && selectedCustomer && (
                    <div className="modal-backdrop">
                        <div className="modal" style={{ minWidth: 320 }}>
                            <button
                                type="button"
                                className="modal-close"
                                onClick={() => setViewCustomerModalOpen(false)}
                            >
                                ×
                            </button>

                            <h2 style={{ marginBottom: 10, fontSize: 16 }}>Customer details</h2>

                            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                                <div><strong>Code:</strong> {selectedCustomer.code}</div>
                                <div><strong>Name:</strong> {selectedCustomer.name}</div>
                                <div><strong>Phone:</strong> {selectedCustomer.phone}</div>
                                {selectedCustomer.phone2 && (
                                    <div><strong>Phone 2:</strong> {selectedCustomer.phone2}</div>
                                )}
                                {selectedCustomer.address && (
                                    <div><strong>Address:</strong> {selectedCustomer.address}</div>
                                )}
                                {selectedCustomer.rnc && (
                                    <div><strong>Tax ID (RNC):</strong> {selectedCustomer.rnc}</div>
                                )}
                            </div>

                            <div style={{ marginTop: 12, textAlign: "right" }}>
                                <button
                                    type="button"
                                    className="button-primary"
                                    onClick={() => setViewCustomerModalOpen(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default CustomersPage;
