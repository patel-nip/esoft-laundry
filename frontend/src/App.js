import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CreateOrderPage from "./pages/CreateOrderPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import InvoiceOrderPage from "./pages/InvoiceOrderPage";
import CustomersPage from "./pages/CustomersPage";
import ReportsServicesPage from "./pages/ReportServicePage";
import SettingsPage from "./pages/SettingsPage";
import ServicePricesPage from "./pages/settings/ServicePricesPage";
import CompanyInfoPage from "./pages/settings/CompanyInfoPage";
import InvoiceMessagePage from "./pages/settings/InvoiceMessagePage";
import UsersPage from "./pages/settings/UsersPage";
import RolesPage from "./pages/settings/RolesPage";
import NCFConfigPage from "./pages/settings/NCFConfigPage";
import PrintersPage from "./pages/settings/PrintersPage";
import BackupPage from "./pages/settings/BackupPage";
import { startActivityTracking, stopActivityTracking, checkSessionExpiry } from "./utils/ActivityTracker";
import { authHelpers } from "./services/api";

function AppContent() {
  useEffect(() => {
    if (checkSessionExpiry()) {
      authHelpers.removeToken();
      localStorage.removeItem('last_activity');
      window.location.href = '/login';
      return;
    }

    startActivityTracking();

    return () => {
      stopActivityTracking();
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Dashboard - No specific permission required, just logged in */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Order Management Routes */}
      <Route
        path="/dashboard/orders/create"
        element={
          <ProtectedRoute requiredPermission="create_order">
            <CreateOrderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/orders/status"
        element={
          <ProtectedRoute requiredPermission="order_status">
            <OrderStatusPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/orders/invoice"
        element={
          <ProtectedRoute requiredPermission="invoice_order">
            <InvoiceOrderPage />
          </ProtectedRoute>
        }
      />

      {/* Customers - Uses order_status permission */}
      <Route
        path="/dashboard/customers"
        element={
          <ProtectedRoute requiredPermission="order_status">
            <CustomersPage />
          </ProtectedRoute>
        }
      />

      {/* Reports */}
      <Route
        path="/dashboard/reports"
        element={
          <ProtectedRoute requiredPermission="reports">
            <ReportsServicesPage />
          </ProtectedRoute>
        }
      />

      {/* Settings - Main page accessible to all */}
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Settings Sub-pages - Each protected by specific permission */}
      <Route
        path="/settings/service-prices"
        element={
          <ProtectedRoute requiredPermission="service_prices">
            <ServicePricesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/company"
        element={
          <ProtectedRoute requiredPermission="company">
            <CompanyInfoPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/invoice-message"
        element={
          <ProtectedRoute requiredPermission="invoice_message">
            <InvoiceMessagePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/users"
        element={
          <ProtectedRoute requiredPermission="users">
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/roles"
        element={
          <ProtectedRoute requiredPermission="roles">
            <RolesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/ncf"
        element={
          <ProtectedRoute requiredPermission="tax_receipts">
            <NCFConfigPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/printers"
        element={
          <ProtectedRoute requiredPermission="printers">
            <PrintersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/backup"
        element={
          <ProtectedRoute requiredPermission="backup">
            <BackupPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
