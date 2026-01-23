import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const SETTINGS_ITEMS = [
    {
        id: "backup",
        title: "Backup",
        description:
            "You can make a backup of the database and configure automatic backup copies.",
        icon: "📂",
        path: "/settings/backup",
    },
    {
        id: "roles",
        title: "Roles",
        description:
            "Specify which staff can enter different areas of the system and manage permissions.",
        icon: "👥",
        path: "/settings/roles",
    },
    {
        id: "users",
        title: "Users",
        description:
            "Create, modify or delete system users who have access to the application.",
        icon: "🧑‍💻",
        path: "/settings/users",
    },
    {
        id: "printers",
        title: "Printers",
        description:
            "Change printer type and paper for receipts and reports.",
        icon: "🖨️",
        path: "/settings/printers",
    },
    {
        id: "company",
        title: "Company",
        description:
            "View and edit company information such as name, address and phone numbers.",
        icon: "🏬",
        path: "/settings/company",
    },
    {
        id: "ncf",
        title: "Tax receipts",
        description:
            "View NCF ranges, modify them and set the current tax receipt number.",
        icon: "📄",
        path: "/settings/ncf",
    },
    {
        id: "invoice-message",
        title: "Invoice message",
        description:
            "Define or change the final message printed at the bottom of all invoices.",
        icon: "✉️",
        path: "/settings/invoice-message",
    },
    {
        id: "prices",
        title: "Service prices",
        description:
            "Set prices per garment and configure express percentage.",
        icon: "💰",
        path: "/settings/service-prices",
    },
];

function SettingsPage() {
    const navigate = useNavigate();

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="dashboard-main">
                <Header />
                <div className="dashboard-content settings-grid-layout">
                    <div className="settings-grid-header">
                        <h1 className="settings-grid-title">Configuration</h1>
                    </div>

                    <div className="settings-grid">
                        {SETTINGS_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                className="settings-card"
                                type="button"
                                onClick={() => navigate(item.path)}
                            >
                                <div className="settings-card-icon">
                                    <span>{item.icon}</span>
                                </div>
                                <div className="settings-card-text">
                                    <h2>{item.title}</h2>
                                    <p>{item.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default SettingsPage;
