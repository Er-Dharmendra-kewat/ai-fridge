import { useState, useEffect } from "react";


// ── Data ──────────────────────────────────────────────────────────────────────
const INVENTORY = [
  { id: 1, name: "Whole Milk", qty: 1, expiry: 1, barcode: "8939203", category: "Dairy", unit: "L", icon: "🥛" },
  { id: 2, name: "Free-Range Eggs", qty: 6, expiry: 5, barcode: "2039203", category: "Protein", unit: "pcs", icon: "🥚" },
  { id: 3, name: "Roma Tomatoes", qty: 3, expiry: 2, barcode: "1293823", category: "Vegetables", unit: "pcs", icon: "🍅" },
  { id: 4, name: "Aged Cheddar", qty: 1, expiry: 14, barcode: "3928102", category: "Dairy", unit: "block", icon: "🧀" },
  { id: 5, name: "Sourdough Bread", qty: 1, expiry: 3, barcode: "9182736", category: "Bakery", unit: "loaf", icon: "🍞" },
  { id: 6, name: "Baby Spinach", qty: 1, expiry: 1, barcode: "4728391", category: "Vegetables", unit: "bag", icon: "🥬" },
  { id: 7, name: "Greek Yogurt", qty: 2, expiry: 7, barcode: "6547382", category: "Dairy", unit: "cups", icon: "🫙" },
  { id: 8, name: "Orange Juice", qty: 0, expiry: 0, barcode: "8374629", category: "Beverages", unit: "L", icon: "🍊" },
  { id: 9, name: "Butter", qty: 1, expiry: 21, barcode: "2938475", category: "Dairy", unit: "block", icon: "🧈" },
  { id: 10, name: "Red Onion", qty: 2, expiry: 30, barcode: "5647382", category: "Vegetables", unit: "pcs", icon: "🧅" },
];

const RECIPES = [
  { id: 1, name: "Cheese Omelette", time: "10 min", difficulty: "Easy", ingredients: ["Eggs", "Cheddar", "Butter"], emoji: "🍳", desc: "Fluffy omelette with melted cheddar and fresh herbs." },
  { id: 2, name: "Tomato & Egg Toast", time: "15 min", difficulty: "Easy", ingredients: ["Eggs", "Tomatoes", "Bread", "Butter"], emoji: "🥪", desc: "Buttered toast topped with fried egg and fresh tomatoes." },
  { id: 3, name: "Spinach Frittata", time: "20 min", difficulty: "Medium", ingredients: ["Eggs", "Spinach", "Cheddar", "Onion"], emoji: "🥘", desc: "Italian baked egg dish with wilted spinach and cheese." },
  { id: 4, name: "Grilled Cheese", time: "8 min", difficulty: "Easy", ingredients: ["Bread", "Cheddar", "Butter"], emoji: "🫓", desc: "Golden, crispy bread with gooey melted cheese inside." },
  { id: 5, name: "Tomato Bruschetta", time: "12 min", difficulty: "Easy", ingredients: ["Bread", "Tomatoes", "Onion"], emoji: "🍅", desc: "Toasted bread topped with fresh tomato and onion salsa." },
  { id: 6, name: "Yogurt Parfait", time: "5 min", difficulty: "Easy", ingredients: ["Yogurt", "Milk"], emoji: "🍨", desc: "Creamy yogurt layered with fresh ingredients." },
];

const ALERTS = [
  { id: 1, type: "expiry", severity: "critical", item: "Whole Milk", message: "Expires tomorrow", icon: "🥛" },
  { id: 2, type: "expiry", severity: "critical", item: "Baby Spinach", message: "Expires today", icon: "🥬" },
  { id: 3, type: "expiry", severity: "warning", item: "Roma Tomatoes", message: "Expires in 2 days", icon: "🍅" },
  { id: 4, type: "expiry", severity: "warning", item: "Sourdough Bread", message: "Expires in 3 days", icon: "🍞" },
  { id: 5, type: "stock", severity: "critical", item: "Orange Juice", message: "Out of stock", icon: "🍊" },
  { id: 6, type: "stock", severity: "warning", item: "Whole Milk", message: "Only 1 unit left", icon: "🥛" },
];

const ORDERS = [
  { id: 1, name: "Orange Juice", reason: "Out of stock", icon: "🍊", price: "₹80" },
  { id: 2, name: "Whole Milk", reason: "Expiring + Low qty", icon: "🥛", price: "₹60" },
  { id: 3, name: "Baby Spinach", reason: "Expiring today", icon: "🥬", price: "₹45" },
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

// ── Helpers ───────────────────────────────────────────────────────────────────
const expiryColor = (days) => {
  if (days === 0) return "#ef4444";
  if (days <= 2) return "#f97316";
  if (days <= 5) return "#eab308";
  return "#22c55e";
};

const expiryLabel = (days) => {
  if (days === 0) return "Out of stock";
  if (days === 1) return "Tomorrow";
  if (days <= 5) return `${days} days`;
  return `${days} days`;
};

// ── Sparkline ─────────────────────────────────────────────────────────────────
function MiniBar({ data, color }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32 }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: `${(v / max) * 100}%`,
            background: color,
            borderRadius: 2,
            opacity: 0.7 + (i / data.length) * 0.3,
            transition: "height 0.5s ease",
          }}
        />
      ))}
    </div>
  );
}

// ── Page: Dashboard ───────────────────────────────────────────────────────────
function Dashboard() {
  const total = INVENTORY.filter((i) => i.qty > 0).length;
  const expiring = INVENTORY.filter((i) => i.qty > 0 && i.expiry <= 3).length;
  const outOfStock = INVENTORY.filter((i) => i.qty === 0).length;

  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f8fafc", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: -1 }}>
          Good morning! <span style={{ color: "#38bdf8" }}>👋</span>
        </h1>
        <p style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>Here's what's happening in your smart fridge today.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total Items", value: total, sub: "in fridge", color: "#38bdf8", icon: "📦", bg: "rgba(56,189,248,0.1)" },
          { label: "Expiring Soon", value: expiring, sub: "within 3 days", color: "#f97316", icon: "⏳", bg: "rgba(249,115,22,0.1)" },
          { label: "Out of Stock", value: outOfStock, sub: "need reorder", color: "#ef4444", icon: "🚨", bg: "rgba(239,68,68,0.1)" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: "20px 22px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 16, right: 16, fontSize: 28, opacity: 0.15 }}>{s.icon}</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: s.color, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginTop: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        {/* Inventory preview */}
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8 }}>Inventory Preview</span>
            <span style={{ fontSize: 11, color: "#38bdf8", cursor: "pointer" }}>View all →</span>
          </div>
          {INVENTORY.slice(0, 6).map((item) => (
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
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.qty === 0 ? "#ef4444" : expiryColor(item.expiry) }} />
              </div>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Alerts mini */}
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>Active Alerts</div>
            {ALERTS.slice(0, 3).map((a) => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #1e293b" }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: a.severity === "critical" ? "#ef4444" : "#f97316", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: a.severity === "critical" ? "#fca5a5" : "#fdba74" }}>{a.icon} {a.item} — {a.message}</span>
              </div>
            ))}
          </div>

          {/* Consumption mini */}
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
          {RECIPES.slice(0, 3).map((r) => (
            <div key={r.id} style={{ background: "#1e293b", borderRadius: 12, padding: 16, cursor: "pointer", transition: "transform 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
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

// ── Page: Inventory ───────────────────────────────────────────────────────────
function Inventory() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [items, setItems] = useState(INVENTORY);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", qty: 1, expiry: 7, category: "Dairy", icon: "📦" });

  const categories = ["All", ...new Set(INVENTORY.map((i) => i.category))];
  const filtered = items.filter((i) =>
    (filter === "All" || i.category === filter) &&
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id, delta) => setItems((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i));

  return (
    <div style={{ padding: "0 0 40px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f8fafc", marginBottom: 6, letterSpacing: -0.5 }}>Inventory</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Manage everything stored in your fridge.</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍  Search items..."
          style={{ flex: 1, minWidth: 200, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, outline: "none" }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          {categories.map((c) => (
            <button key={c} onClick={() => setFilter(c)}
              style={{ padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.2s",
                background: filter === c ? "#38bdf8" : "#1e293b", color: filter === c ? "#0f172a" : "#94a3b8" }}>
              {c}
            </button>
          ))}
        </div>
        <button onClick={() => setAdding(true)}
          style={{ padding: "8px 18px", background: "#38bdf8", border: "none", borderRadius: 8, color: "#0f172a", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          + Add Item
        </button>
      </div>

      {adding && (
        <div style={{ background: "#0f172a", border: "1px solid #38bdf8", borderRadius: 14, padding: 20, marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          {[["Name", "name", "text"], ["Qty", "qty", "number"], ["Expiry (days)", "expiry", "number"]].map(([label, key, type]) => (
            <div key={key}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{label}</div>
              <input type={type} value={newItem[key]}
                onChange={(e) => setNewItem((p) => ({ ...p, [key]: type === "number" ? +e.target.value : e.target.value }))}
                style={{ width: 120, background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "8px 12px", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
            </div>
          ))}
          <button onClick={() => {
            setItems((p) => [...p, { ...newItem, id: Date.now(), barcode: Math.floor(Math.random() * 9999999).toString().padStart(7, "0") }]);
            setAdding(false);
            setNewItem({ name: "", qty: 1, expiry: 7, category: "Dairy", icon: "📦" });
          }} style={{ padding: "8px 20px", background: "#22c55e", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
            Save
          </button>
          <button onClick={() => setAdding(false)} style={{ padding: "8px 16px", background: "#1e293b", border: "none", borderRadius: 8, color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>
            Cancel
          </button>
        </div>
      )}

      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e293b" }}>
              {["Product", "Category", "Qty", "Expiry", "Barcode", "Actions"].map((h) => (
                <th key={h} style={{ padding: "14px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #1e293b", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#1e293b"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "13px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{item.name}</span>
                  </div>
                </td>
                <td style={{ padding: "13px 18px" }}>
                  <span style={{ fontSize: 11, background: "#1e293b", border: "1px solid #334155", padding: "3px 10px", borderRadius: 20, color: "#94a3b8", fontWeight: 600 }}>{item.category}</span>
                </td>
                <td style={{ padding: "13px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{ width: 22, height: 22, borderRadius: 6, background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", cursor: "pointer", fontSize: 14, lineHeight: 1 }}>−</button>
                    <span style={{ fontSize: 13, color: "#e2e8f0", minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} style={{ width: 22, height: 22, borderRadius: 6, background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", cursor: "pointer", fontSize: 14, lineHeight: 1 }}>+</button>
                  </div>
                </td>
                <td style={{ padding: "13px 18px" }}>
                  {item.qty === 0 ? (
                    <span style={{ fontSize: 12, color: "#ef4444", fontWeight: 600 }}>Out of stock</span>
                  ) : (
                    <span style={{ fontSize: 12, fontWeight: 700, color: expiryColor(item.expiry), background: expiryColor(item.expiry) + "22", padding: "3px 10px", borderRadius: 20 }}>
                      {expiryLabel(item.expiry)}
                    </span>
                  )}
                </td>
                <td style={{ padding: "13px 18px" }}>
                  <code style={{ fontSize: 11, color: "#475569", background: "#1e293b", padding: "3px 8px", borderRadius: 6 }}>{item.barcode}</code>
                </td>
                <td style={{ padding: "13px 18px" }}>
                  <button onClick={() => remove(item.id)}
                    style={{ padding: "5px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 7, color: "#ef4444", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "#475569", fontSize: 14 }}>No items found</div>
        )}
      </div>
    </div>
  );
}

// ── Page: Recipes ─────────────────────────────────────────────────────────────
function Recipes() {
  const [selected, setSelected] = useState(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const askAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResult("");
    try {
      const fridgeItems = INVENTORY.filter(i => i.qty > 0).map(i => i.name).join(", ");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `My fridge contains: ${fridgeItems}.\n\nUser question: ${aiPrompt}\n\nPlease suggest a recipe or answer the cooking question based on these ingredients. Be concise and practical.`
          }]
        })
      });
      const data = await res.json();
      setAiResult(data.content?.[0]?.text || "No response received.");
    } catch (e) {
      setAiResult("Could not connect to AI. Please try again.");
    }
    setAiLoading(false);
  };

  return (
    <div style={{ padding: "0 0 40px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f8fafc", marginBottom: 6, letterSpacing: -0.5 }}>AI Recipes</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Smart suggestions based on what's in your fridge right now.</p>

      {/* Ingredient chips */}
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 18, marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>Available Ingredients</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {INVENTORY.filter(i => i.qty > 0).map(i => (
            <span key={i.id} style={{ background: "#1e293b", border: "1px solid #334155", padding: "5px 12px", borderRadius: 20, fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
              {i.icon} {i.name}
            </span>
          ))}
        </div>
      </div>

      {/* AI Chat */}
      <div style={{ background: "linear-gradient(135deg, #0c1a2e, #0f172a)", border: "1px solid #1e3a5f", borderRadius: 16, padding: 22, marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#38bdf8", marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.8 }}>🧠 Ask the AI Chef</div>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            onKeyDown={e => e.key === "Enter" && askAI()}
            placeholder="e.g. What can I cook for dinner tonight?"
            style={{ flex: 1, background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, outline: "none" }}
          />
          <button onClick={askAI} disabled={aiLoading}
            style={{ padding: "10px 22px", background: aiLoading ? "#334155" : "#38bdf8", border: "none", borderRadius: 10, color: aiLoading ? "#64748b" : "#0f172a", fontWeight: 700, fontSize: 13, cursor: aiLoading ? "default" : "pointer" }}>
            {aiLoading ? "Thinking..." : "Ask →"}
          </button>
        </div>
        {aiResult && (
          <div style={{ marginTop: 16, background: "#1e293b", borderRadius: 10, padding: 16, fontSize: 13, color: "#cbd5e1", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {aiResult}
          </div>
        )}
      </div>

      {/* Recipe cards */}
      <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 16 }}>Suggested Recipes</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {RECIPES.map(r => (
          <div key={r.id}
            onClick={() => setSelected(selected?.id === r.id ? null : r)}
            style={{ background: "#0f172a", border: selected?.id === r.id ? "1px solid #38bdf8" : "1px solid #1e293b", borderRadius: 16, padding: 20, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { if (selected?.id !== r.id) e.currentTarget.style.borderColor = "#334155"; }}
            onMouseLeave={e => { if (selected?.id !== r.id) e.currentTarget.style.borderColor = "#1e293b"; }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{r.emoji}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>{r.name}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>{r.desc}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, background: "rgba(56,189,248,0.1)", color: "#38bdf8", padding: "2px 8px", borderRadius: 12, fontWeight: 600 }}>⏱ {r.time}</span>
              <span style={{ fontSize: 11, background: "#1e293b", color: "#94a3b8", padding: "2px 8px", borderRadius: 12, fontWeight: 600 }}>{r.difficulty}</span>
            </div>
            {selected?.id === r.id && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #1e293b" }}>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Ingredients</div>
                {r.ingredients.map(i => (
                  <div key={i} style={{ fontSize: 12, color: "#94a3b8", padding: "3px 0" }}>• {i}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page: Alerts ──────────────────────────────────────────────────────────────
function AlertsPage() {
  const expiry = ALERTS.filter(a => a.type === "expiry");
  const stock = ALERTS.filter(a => a.type === "stock");
  return (
    <div style={{ padding: "0 0 40px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f8fafc", marginBottom: 6, letterSpacing: -0.5 }}>Alerts</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>Stay on top of expiry dates and stock levels.</p>

      {[{ title: "⏳ Expiry Alerts", items: expiry }, { title: "📦 Stock Alerts", items: stock }].map(({ title, items }) => (
        <div key={title} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>{title}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map(a => (
              <div key={a.id} style={{
                background: "#0f172a", border: `1px solid ${a.severity === "critical" ? "rgba(239,68,68,0.3)" : "rgba(249,115,22,0.25)"}`,
                borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                  background: a.severity === "critical" ? "rgba(239,68,68,0.12)" : "rgba(249,115,22,0.1)"
                }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{a.item}</div>
                  <div style={{ fontSize: 12, color: a.severity === "critical" ? "#fca5a5" : "#fdba74", marginTop: 2 }}>{a.message}</div>
                </div>
                <div style={{
                  padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5,
                  background: a.severity === "critical" ? "rgba(239,68,68,0.15)" : "rgba(249,115,22,0.12)",
                  color: a.severity === "critical" ? "#ef4444" : "#f97316", border: `1px solid ${a.severity === "critical" ? "rgba(239,68,68,0.3)" : "rgba(249,115,22,0.3)"}`
                }}>{a.severity}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Page: Orders ──────────────────────────────────────────────────────────────
function Orders() {
  const [ordered, setOrdered] = useState([]);
  return (
    <div style={{ padding: "0 0 40px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f8fafc", marginBottom: 6, letterSpacing: -0.5 }}>Orders</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>Restock items that are out or expiring soon.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
        {ORDERS.map(o => (
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
              <button onClick={() => setOrdered(p => [...p, o.id])}
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
        <button
          onClick={() => setOrdered(ORDERS.map(o => o.id))}
          style={{ padding: "12px 32px", background: "linear-gradient(135deg, #38bdf8, #818cf8)", border: "none", borderRadius: 10, color: "#0f172a", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
          Order All Items
        </button>
      </div>
    </div>
  );
}

// ── App Shell ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "inventory", label: "Inventory", icon: "≡" },
  { id: "recipes", label: "Recipes", icon: "✦" },
  { id: "alerts", label: "Alerts", icon: "◈" },
  { id: "orders", label: "Orders", icon: "↑" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");

  const pages = { dashboard: Dashboard, inventory: Inventory, recipes: Recipes, alerts: AlertsPage, orders: Orders };
  const Page = pages[page];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #020817; font-family: 'Space Grotesk', sans-serif; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        input::placeholder { color: #475569; }
      `}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: "#020817" }}>
        {/* Sidebar */}
        <div style={{ width: 220, background: "#0a0f1e", borderRight: "1px solid #1e293b", padding: "28px 0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          {/* Logo */}
          <div style={{ padding: "0 20px 28px", borderBottom: "1px solid #1e293b" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #38bdf8, #818cf8)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>❄</div>
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
            <div style={{ fontSize: 11, color: "#64748b" }}>🌡 3.2°C · 💧 45% RH</div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "8px 10px" }}>
            {NAV.map((n) => {
              const alertCount = n.id === "alerts" ? ALERTS.length : n.id === "orders" ? ORDERS.length : 0;
              return (
                <button key={n.id} onClick={() => setPage(n.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 2, transition: "all 0.15s", textAlign: "left",
                    background: page === n.id ? "rgba(56,189,248,0.12)" : "transparent",
                    color: page === n.id ? "#38bdf8" : "#64748b",
                    borderLeft: page === n.id ? "2px solid #38bdf8" : "2px solid transparent"
                  }}>
                  <span style={{ fontSize: 16, width: 18, textAlign: "center" }}>{n.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: page === n.id ? 700 : 500, flex: 1 }}>{n.label}</span>
                  {alertCount > 0 && (
                    <span style={{ fontSize: 10, background: n.id === "alerts" ? "#ef4444" : "#38bdf8", color: "#fff", borderRadius: 10, padding: "1px 6px", fontWeight: 700 }}>{alertCount}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom */}
          <div style={{ padding: "18px 14px 0", borderTop: "1px solid #1e293b" }}>
            <div style={{ fontSize: 10, color: "#334155", textAlign: "center" }}>v2.4.1 · Raspberry Pi 4</div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: "36px 36px 20px", overflowY: "auto", maxHeight: "100vh" }}>
          <Page />
        </div>
      </div>
    </>
  );
}
