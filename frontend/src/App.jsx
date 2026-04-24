import { useState, useEffect } from "react";

import {
  FaHome,
  FaBoxOpen,
  FaUtensils,
  FaBell,
  FaShoppingCart,
  FaUser,
  FaSnowflake
} from "react-icons/fa";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Recipes from "./pages/Recipes";
import AlertsPage from "./pages/Alerts";
import Orders from "./pages/Orders";
import Auth from "./pages/Auth";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
  { id: "inventory", label: "Inventory", icon: <FaBoxOpen /> },
  { id: "recipes", label: "Recipes", icon: <FaUtensils /> },
  { id: "alerts", label: "Alerts", icon: <FaBell /> },
  { id: "orders", label: "Orders", icon: <FaShoppingCart /> },
  { id: "auth", label: "Login / Register", icon: <FaUser /> }
];

export default function App() {
  const [page, setPage] = useState("auth");
  const [user, setUser] = useState(null);

  // 🔥 AUTO LOGIN
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
      setPage("dashboard");
    }
  }, []);

  // 🔒 PROTECT ROUTES
  if (!user && page !== "auth") {
    return <Auth setUser={setUser} />;
  }

  const pages = {
    dashboard: Dashboard,
    inventory: Inventory,
    recipes: Recipes,
    alerts: AlertsPage,
    orders: Orders,
    auth: () => <Auth setUser={setUser} />
  };

  const Page = pages[page];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#020817"
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: 240,
          background: "#0a0f1e",
          borderRight: "1px solid #1e293b",
          padding: 20
        }}
      >
        {/* LOGO */}
        <div style={{ marginBottom: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff"
              }}
            >
              <FaSnowflake />
            </div>

            <div>
              <div style={{ color: "#fff", fontWeight: 700 }}>
                FridgeAI
              </div>
              <div style={{ fontSize: 11, color: "#64748b" }}>
                Smart Dashboard
              </div>
            </div>
          </div>
        </div>

        {/* MENU TITLE */}
        <div
          style={{
            fontSize: 11,
            color: "#64748b",
            marginBottom: 10,
            paddingLeft: 4
          }}
        >
          MENU
        </div>

        {/* NAV ITEMS */}
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              marginBottom: 6,
              padding: "12px 14px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              background:
                page === n.id
                  ? "rgba(56,189,248,0.15)"
                  : "transparent",
              color: page === n.id ? "#38bdf8" : "#94a3b8",
              borderLeft:
                page === n.id
                  ? "3px solid #38bdf8"
                  : "3px solid transparent"
            }}
          >
            <span style={{ fontSize: 16 }}>{n.icon}</span>
            <span style={{ fontSize: 14 }}>{n.label}</span>
          </button>
        ))}

        {/* LOGOUT */}
        {user && (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setUser(null);
              setPage("auth");
            }}
            style={{
              marginTop: 20,
              width: "100%",
              padding: 12,
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Page />
      </div>
    </div>
  );
}