import React, { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import ServicePriceTable from "../../components/settings/ServicePriceTable";
import ServicePriceModal from "../../components/settings/ServicePriceModal";
import { servicePricesAPI } from "../../services/api";

function ServicePricesPage() {
    const [servicePrices, setServicePrices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPrice, setEditingPrice] = useState(null);

    useEffect(() => {
        fetchServicePrices();
    }, []);

    async function fetchServicePrices() {
        setLoading(true);
        setError("");
        try {
            const data = await servicePricesAPI.getAll();
            setServicePrices(data.servicePrices);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleAddNew() {
        setEditingPrice(null);
        setModalOpen(true);
    }

    function handleEdit(price) {
        setEditingPrice(price);
        setModalOpen(true);
    }

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this service price?")) {
            return;
        }

        setLoading(true);
        setError("");
        try {
            await servicePricesAPI.delete(id);
            await fetchServicePrices();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(priceData) {
        setLoading(true);
        setError("");
        try {
            if (editingPrice) {
                await servicePricesAPI.update(editingPrice.id, priceData);
            } else {
                await servicePricesAPI.create(priceData);
            }
            await fetchServicePrices();
            setModalOpen(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="dashboard-main">
                <Header />
                <div>
                    <div className="customers-header-bar">
                        <h1 className="customers-title">Service Prices</h1>
                        <button
                            className="customers-action-button"
                            type="button"
                            onClick={handleAddNew}
                        >
                            Add New Service
                        </button>
                    </div>

                    {error && (
                        <div style={{ padding: "12px 20px", background: "#991b1b", color: "#fecaca", marginBottom: "16px" }}>
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div style={{ padding: 20, textAlign: "center" }}>Loading...</div>
                    ) : (
                        <ServicePriceTable
                            servicePrices={servicePrices}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}

                    {modalOpen && (
                        <ServicePriceModal
                            price={editingPrice}
                            onSave={handleSave}
                            onClose={() => setModalOpen(false)}
                            loading={loading}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

export default ServicePricesPage;
