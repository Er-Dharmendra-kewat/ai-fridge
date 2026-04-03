import { useState } from "react";

const INVENTORY = [
  { id: 1, name: "Whole Milk", qty: 1, expiry: 1, barcode: "8939203", category: "Dairy", unit: "L", icon: "🥛" },
  { id: 2, name: "Free-Range Eggs", qty: 6, expiry: 5, barcode: "2039203", category: "Protein", unit: "pcs", icon: "🥚" },
  { id: 3, name: "Roma Tomatoes", qty: 3, expiry: 2, barcode: "1293823", category: "Vegetables", unit: "pcs", icon: "🍅" },
  { id: 4, name: "Aged Cheddar", qty: 1, expiry: 14, barcode: "3928102", category: "Dairy", unit: "block", icon: "🧀" },
  { id: 5, name: "Sourdough Bread", qty: 1, expiry: 3, barcode: "9182736", category: "Bakery", unit: "loaf", icon: "🍞" },
  { id: 6, name: "Baby Spinach", qty: 1, expiry: 1, barcode: "4728391", category: "Vegetables", unit: "bag", icon: "🥬" },
];

const RECIPES = [
  { id: 1, name: "Cheese Omelette", time: "10 min", difficulty: "Easy", emoji: "🍳" },
  { id: 2, name: "Tomato & Egg Toast", time: "15 min", difficulty: "Easy", emoji: "🥪" },
  { id: 3, name: "Spinach Frittata", time: "20 min", difficulty: "Medium", emoji: "🥘" },
];

const ALERTS = [
  { id: 1, severity: "critical", item: "Whole Milk", message: "Expires tomorrow", icon: "🥛" },
  { id: 2, severity: "critical", item: "Baby Spinach", message: "Expires today", icon: "🥬" },
  { id: 3, severity: "warning", item: "Roma Tomatoes", message: "Expires in 2 days", icon: "🍅" },
];

const CONSUMPTION = [
  { day: "Mon", milk: 0.3, eggs: 2 },
  { day: "Tue", milk: 0.5, eggs: 1 },
  { day: "Wed", milk: 0.2, eggs: 3 },
  { day: "Thu", milk: 0.4, eggs: 0 },
  { day: "Fri", milk: 0.6, eggs: 2 },
  { day: "Sat", milk: 0.3, eggs: 4 },
  { day: "Sun", milk: 0.1, eggs: 1 },
];

const expiryColor = (days) => {
  if (days <= 1) return "#ef4444";
  if (days <= 2) return "#f97316";
  if (days <= 5) return "#eab308";
  return "#22c55e";
};

function MiniBar({ data, color }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32 }}>
      {data.map((v, i) => (
        <div key={i} style={{ width: 8, height: `${(v / max) * 100}%`, background: color, borderRadius: 2, opacity: 0.7 + (i / data.length) * 0.3 }} />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const total      = INVENTORY.filter((i) => i.qty > 0).length;
  const expiring   = INVENTORY.filter((i) => i.qty > 0 && i.expiry <= 3).length;
  const outOfStock = INVENTORY.filter((i) => i.qty === 0).length;

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f8fafc", letterSpacing: -1 }}>
          Good morning! <span style={{ color: "#38bdf8" }}>👋</span>
        </h1>
        <p style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>Here's what's happening in your smart fridge today.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total Items",   value: total,      sub: "in fridge",      color: "#38bdf8", icon: "📦" },
          { label: "Expiring Soon", value: expiring,   sub: "within 3 days",  color: "#f97316", icon: "⏳" },
          { label: "Out of Stock",  value: outOfStock, sub: "need reorder",   color: "#ef4444", icon: "🚨" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: "20px 22px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 16, right: 16, fontSize: 28, opacity: 0.15 }}>{s.icon}</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginTop: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        {/* Inventory preview */}
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 22 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 18 }}>Inventory Preview</div>
          {INVENTORY.map((item) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1e293b" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>{item.category}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>×{item.qty} {item.unit}</span>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: expiryColor(item.expiry) }} />
              </div>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>Active Alerts</div>
            {ALERTS.map((a) => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #1e293b" }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: a.severity === "critical" ? "#ef4444" : "#f97316" }} />
                <span style={{ fontSize: 12, color: a.severity === "critical" ? "#fca5a5" : "#fdba74" }}>{a.icon} {a.item} — {a.message}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>This Week</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 6 }}>🥛 Milk (L)</div>
                <MiniBar data={CONSUMPTION.map((c) => c.milk)} color="#38bdf8" />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 6 }}>🥚 Eggs</div>
                <MiniBar data={CONSUMPTION.map((c) => c.eggs)} color="#fb923c" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recipes preview */}
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 22, marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8 }}>🧠 AI Suggested Recipes</span>
          <span style={{ fontSize: 11, background: "rgba(56,189,248,0.15)", color: "#38bdf8", padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>Based on your fridge</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {RECIPES.map((r) => (
            <div key={r.id} style={{ background: "#1e293b", borderRadius: 12, padding: 16, cursor: "pointer" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{r.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{r.name}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>⏱ {r.time} · {r.difficulty}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}