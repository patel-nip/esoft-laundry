import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CreateOrderPage from "./pages/CreateOrderPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import InvoiceOrderPage from "./pages/InvoiceOrderPage";
import CustomersPage from "./pages/CustomersPage";
import ReportsServicesPage from "./pages/ReportServicePage";
import SettingsPage from "./pages/SettingsPage";
import { authHelpers } from "./services/api";
import ServicePricesPage from "./pages/settings/ServicePricesPage";
import CompanyInfoPage from "./pages/settings/CompanyInfoPage";
import InvoiceMessagePage from "./pages/settings/InvoiceMessagePage";
import UsersPage from "./pages/settings/UsersPage";
import RolesPage from "./pages/settings/RolesPage";
import NCFConfigPage from "./pages/settings/NCFConfigPage";
import PrintersPage from "./pages/settings/PrintersPage";
import BackupPage from "./pages/settings/BackupPage";
import { startActivityTracking, stopActivityTracking, checkSessionExpiry } from "./utils/ActivityTracker";

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const token = authHelpers.getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
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
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/orders/create"
          element={
            <ProtectedRoute>
              <CreateOrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/orders/status"
          element={
            <ProtectedRoute>
              <OrderStatusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/orders/invoice"
          element={
            <ProtectedRoute>
              <InvoiceOrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/customers"
          element={
            <ProtectedRoute>
              <CustomersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/reports"
          element={
            <ProtectedRoute>
              <ReportsServicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/settings/service-prices"
          element={
            <ProtectedRoute>
              <ServicePricesPage />
            </ProtectedRoute>
          }
        />
        <Route path="/settings/company"
          element={
            <ProtectedRoute>
              <CompanyInfoPage />
            </ProtectedRoute>
          }
        />
        <Route path="/settings/invoice-message"
          element={
            <ProtectedRoute>
              <InvoiceMessagePage />
            </ProtectedRoute>
          }
        />
        <Route path="/settings/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route path="/settings/roles"
          element={
            <ProtectedRoute>
              <RolesPage />
            </ProtectedRoute>
          }
        />
        <Route path="/settings/ncf"
          element={
            <ProtectedRoute>
              <NCFConfigPage />
            </ProtectedRoute>
          }
        />
        <Route path="/settings/printers"
          element={
            <ProtectedRoute>
              <PrintersPage />
            </ProtectedRoute>
          }
        />
        <Route path="/settings/backup"
          element={
            <ProtectedRoute>
              <BackupPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
