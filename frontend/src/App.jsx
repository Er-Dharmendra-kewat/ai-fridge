// src/App.jsx
import { useState } from "react";
import Dashboard  from "./pages/Dashboard";
import Inventory  from "./pages/Inventory";
import Recipes    from "./pages/Recipes";
import AlertsPage from "./pages/Alerts";
import Orders     from "./pages/Orders";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "inventory", label: "Inventory", icon: "≡" },
  { id: "recipes",   label: "Recipes",   icon: "✦" },
  { id: "alerts",    label: "Alerts",    icon: "◈" },
  { id: "orders",    label: "Orders",    icon: "↑" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");

  const pages = {
    dashboard: Dashboard,
    inventory: Inventory,
    recipes:   Recipes,
    alerts:    AlertsPage,
    orders:    Orders,
  };

  const Page = pages[page];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #020817; font-family: 'Space Grotesk', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        input::placeholder { color: #475569; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: "#020817" }}>

        {/* ── Sidebar ── */}
        <div style={{ width: 220, background: "#0a0f1e", borderRight: "1px solid #1e293b", padding: "28px 0", display: "flex", flexDirection: "column", flexShrink: 0 }}>

          {/* Logo */}
          <div style={{ padding: "0 20px 28px", borderBottom: "1px solid #1e293b" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #38bdf8, #818cf8)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                ❄
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#f8fafc", letterSpacing: -0.3 }}>FridgeAI</div>
                <div style={{ fontSize: 10, color: "#475569", fontWeight: 600 }}>Smart Dashboard</div>
              </div>
            </div>
          </div>

          {/* Fridge status */}
          <div style={{ margin: "18px 12px", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Fridge Status</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>Online</span>
            </div>
            <div style={{ fontSize: 11, color: "#64748b" }}>🌡 3.2°C &nbsp;·&nbsp; 💧 45% RH</div>
          </div>

          {/* Nav links */}
          <nav style={{ flex: 1, padding: "8px 10px" }}>
            {NAV.map((n) => {
              const badge = n.id === "alerts" ? 6 : n.id === "orders" ? 3 : 0;
              return (
                <button
                  key={n.id}
                  onClick={() => setPage(n.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                    marginBottom: 2, transition: "all 0.15s", textAlign: "left",
                    background:   page === n.id ? "rgba(56,189,248,0.12)" : "transparent",
                    color:        page === n.id ? "#38bdf8" : "#64748b",
                    borderLeft:   page === n.id ? "2px solid #38bdf8" : "2px solid transparent",
                  }}
                >
                  <span style={{ fontSize: 16, width: 18, textAlign: "center" }}>{n.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: page === n.id ? 700 : 500, flex: 1 }}>{n.label}</span>
                  {badge > 0 && (
                    <span style={{ fontSize: 10, background: n.id === "alerts" ? "#ef4444" : "#38bdf8", color: "#fff", borderRadius: 10, padding: "1px 6px", fontWeight: 700 }}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div style={{ padding: "18px 14px 0", borderTop: "1px solid #1e293b" }}>
            <div style={{ fontSize: 10, color: "#334155", textAlign: "center" }}>v2.4.1 · Raspberry Pi 4</div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{ flex: 1, padding: "36px 36px 20px", overflowY: "auto", maxHeight: "100vh" }}>
          <Page />
        </div>

      </div>
    </>
  );
}