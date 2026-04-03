const ALERTS = [
  { id: 1, type: "expiry", severity: "critical", item: "Whole Milk",      message: "Expires tomorrow",    icon: "🥛" },
  { id: 2, type: "expiry", severity: "critical", item: "Baby Spinach",    message: "Expires today",       icon: "🥬" },
  { id: 3, type: "expiry", severity: "warning",  item: "Roma Tomatoes",   message: "Expires in 2 days",   icon: "🍅" },
  { id: 4, type: "expiry", severity: "warning",  item: "Sourdough Bread", message: "Expires in 3 days",   icon: "🍞" },
  { id: 5, type: "stock",  severity: "critical", item: "Orange Juice",    message: "Out of stock",        icon: "🍊" },
  { id: 6, type: "stock",  severity: "warning",  item: "Whole Milk",      message: "Only 1 unit left",    icon: "🥛" },
];

export default function Alerts() {
  const expiry = ALERTS.filter((a) => a.type === "expiry");
  const stock  = ALERTS.filter((a) => a.type === "stock");

  return (
    <div style={{ padding: "0 0 40px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f8fafc", marginBottom: 6, letterSpacing: -0.5 }}>Alerts</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>Stay on top of expiry dates and stock levels.</p>

      {[{ title: "⏳ Expiry Alerts", items: expiry }, { title: "📦 Stock Alerts", items: stock }].map(({ title, items }) => (
        <div key={title} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>{title}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((a) => (
              <div key={a.id} style={{
                background: "#0f172a",
                border: `1px solid ${a.severity === "critical" ? "rgba(239,68,68,0.3)" : "rgba(249,115,22,0.25)"}`,
                borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16,
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                  background: a.severity === "critical" ? "rgba(239,68,68,0.12)" : "rgba(249,115,22,0.1)" }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{a.item}</div>
                  <div style={{ fontSize: 12, color: a.severity === "critical" ? "#fca5a5" : "#fdba74", marginTop: 2 }}>{a.message}</div>
                </div>
                <div style={{
                  padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                  background: a.severity === "critical" ? "rgba(239,68,68,0.15)" : "rgba(249,115,22,0.12)",
                  color: a.severity === "critical" ? "#ef4444" : "#f97316",
                  border: `1px solid ${a.severity === "critical" ? "rgba(239,68,68,0.3)" : "rgba(249,115,22,0.3)"}`,
                }}>{a.severity}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}