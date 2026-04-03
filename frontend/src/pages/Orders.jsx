import { useState } from "react";

const ORDERS = [
  { id: 1, name: "Orange Juice", reason: "Out of stock",        icon: "🍊", price: "₹80" },
  { id: 2, name: "Whole Milk",   reason: "Expiring + Low qty",  icon: "🥛", price: "₹60" },
  { id: 3, name: "Baby Spinach", reason: "Expiring today",      icon: "🥬", price: "₹45" },
];

export default function Orders() {
  const [ordered, setOrdered] = useState([]);

  return (
    <div style={{ padding: "0 0 40px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f8fafc", marginBottom: 6, letterSpacing: -0.5 }}>Orders</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>Restock items that are out or expiring soon.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
        {ORDERS.map((o) => (
          <div key={o.id} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{o.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{o.name}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{o.reason}</div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#38bdf8", marginRight: 8 }}>{o.price}</div>
            {ordered.includes(o.id) ? (
              <div style={{ padding: "8px 18px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 8, color: "#22c55e", fontSize: 12, fontWeight: 700 }}>✓ Ordered</div>
            ) : (
              <button onClick={() => setOrdered((p) => [...p, o.id])}
                style={{ padding: "8px 18px", background: "#38bdf8", border: "none", borderRadius: 8, color: "#0f172a", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                Order Now
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🛒</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>Quick Order All</div>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 18 }}>Order all low-stock and expiring items at once</div>
        <button onClick={() => setOrdered(ORDERS.map((o) => o.id))}
          style={{ padding: "12px 32px", background: "linear-gradient(135deg, #38bdf8, #818cf8)", border: "none", borderRadius: 10, color: "#0f172a", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
          Order All Items
        </button>
      </div>
    </div>
  );
}