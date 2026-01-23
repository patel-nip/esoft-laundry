import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authHelpers } from "../../services/api";
import { jwtDecode } from "jwt-decode";

function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({ username: "User", role: "Staff" });

  useEffect(() => {
    // Get user info from token
    const token = authHelpers.getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          username: decoded.username || "User",
          role: decoded.role || "Staff",
        });
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  function handleLogout() {
    if (window.confirm("Are you sure you want to logout?")) {
      authHelpers.removeToken();
      navigate("/login");
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div>
            <img
              src="/esoft.jpeg"
              alt="logo"
              style={{
                width: 30,
                height: 30,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Laundry Control</div>
            <div className="text-small">Main menu</div>
          </div>
        </div>

        <div
          className="hamburger"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </div>
      </div>

      <div className={`sidebar-nav ${open ? "open" : ""}`}>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>

        <button onClick={() => navigate("/dashboard/orders/create")}>
          Create work order
        </button>

        <button onClick={() => navigate("/dashboard/orders/status")}>
          Order status
        </button>

        <button onClick={() => navigate("/dashboard/orders/invoice")}>
          Invoice order
        </button>

        <button onClick={() => navigate("/dashboard/customers")}>
          Customers &amp; Tax IDs
        </button>

        <button onClick={() => navigate("/dashboard/reports")}>
          Reports
        </button>

        <button onClick={() => navigate("/dashboard/settings")}>
          Settings
        </button>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "16px",
            borderTop: "1px solid #1f2937",
            paddingTop: "16px",
            color: "#ef4444"
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginTop: "auto", fontSize: 12 }}>
        <div style={{ borderTop: "1px solid #1f2937", paddingTop: 8, marginBottom: 8 }}>
          <div className="text-small">Branch</div>
          <div style={{ fontWeight: 500 }}>Main branch</div>
        </div>
        <div>
          <div className="text-small">User</div>
          <div style={{ fontWeight: 500 }}>
            {user.username} · {user.role}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
