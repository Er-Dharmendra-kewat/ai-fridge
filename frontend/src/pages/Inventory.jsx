// src/pages/Inventory.jsx
// Full inventory page wired to the Express + MongoDB backend.
// Real-time updates via Socket.io.

import { useState, useEffect, useCallback } from "react";
import { getItems, addItem, updateItem, deleteItem, scanBarcode } from "../services/api";
import { useSocket } from "../hooks/useSocket";

const expiryColor = (days) => {
  if (days === 0) return "#ef4444";
  if (days <= 2)  return "#f97316";
  if (days <= 5)  return "#eab308";
  return "#22c55e";
};

const expiryLabel = (days) => {
  if (days === 0) return "Out of stock";
  if (days === 1) return "Tomorrow";
  return `${days} days`;
};

// ── Toast notification ────────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, background: "#0f172a",
      border: "1px solid #38bdf8", borderRadius: 12, padding: "14px 20px",
      color: "#e2e8f0", fontSize: 13, fontWeight: 600, zIndex: 1000,
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)", animation: "slideUp 0.3s ease",
    }}>
      {msg}
    </div>
  );
}

export default function Inventory() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("All");
  const [adding,  setAdding]  = useState(false);
  const [toast,   setToast]   = useState(null);
  const [newItem, setNewItem] = useState({ name: "", qty: 1, expiryDays: 7, category: "Dairy", unit: "pcs", icon: "📦", barcode: "" });

  // ── Barcode scanner state ────────────────────────────────────────────────
  const [unknownBarcode, setUnknownBarcode] = useState(null); // triggers "add details" modal

  const showToast = (msg) => setToast(msg);

  // ── Fetch items ──────────────────────────────────────────────────────────
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== "All") params.category = filter;
      if (search)           params.search   = search;
      const data = await getItems(params);
      setItems(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // ── Socket.io real-time handlers ─────────────────────────────────────────
  useSocket({
    "item:added":    (item) => { setItems((p) => [item, ...p]); showToast(`✅ ${item.name} added to fridge!`); },
    "item:updated":  (item) => { setItems((p) => p.map((i) => i._id === item._id ? item : i)); showToast(`🔄 ${item.name} updated`); },
    "item:deleted":  ({ id }) => { setItems((p) => p.filter((i) => i._id !== id)); },
    "item:scanned":  ({ item }) => { showToast(`📡 Scanned: ${item.name} (qty: ${item.qty})`); },
    "barcode:unknown": ({ barcode }) => { setUnknownBarcode(barcode); showToast(`❓ Unknown barcode: ${barcode} — please add details`); },
  });

  // ── CRUD actions ─────────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!newItem.name || !newItem.barcode) return;
    try {
      await addItem(newItem);          // server emits item:added → socket updates UI
      setAdding(false);
      setNewItem({ name: "", qty: 1, expiryDays: 7, category: "Dairy", unit: "pcs", icon: "📦", barcode: "" });
    } catch (e) { showToast("❌ " + e.message); }
  };

  const handleDelete = async (id, name) => {
    try {
      await deleteItem(id);
      showToast(`🗑 ${name} removed`);
    } catch (e) { showToast("❌ " + e.message); }
  };

  const handleQty = async (id, delta) => {
    const item = items.find((i) => i._id === id);
    if (!item) return;
    try {
      await updateItem(id, { qty: Math.max(0, item.qty + delta) });
    } catch (e) { showToast("❌ " + e.message); }
  };

  // ── Complete unknown-barcode item ─────────────────────────────────────────
  const handleUnknownSave = async () => {
    if (!newItem.name) return;
    try {
      await addItem({ ...newItem, barcode: unknownBarcode });
      setUnknownBarcode(null);
      setNewItem({ name: "", qty: 1, expiryDays: 7, category: "Dairy", unit: "pcs", icon: "📦", barcode: "" });
    } catch (e) { showToast("❌ " + e.message); }
  };

  const categories = ["All", ...new Set(items.map((i) => i.category).filter(Boolean))];

  return (
    <div style={{ padding: "0 0 40px" }}>
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f8fafc", marginBottom: 6, letterSpacing: -0.5 }}>Inventory</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Live data from MongoDB — updates in real-time via the scanner.</p>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍  Search items..."
          style={{ flex: 1, minWidth: 200, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, outline: "none" }}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map((c) => (
            <button key={c} onClick={() => setFilter(c)}
              style={{ padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
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

      {/* Add item form */}
      {(adding || unknownBarcode) && (
        <div style={{ background: "#0f172a", border: "1px solid #38bdf8", borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#38bdf8", marginBottom: 14 }}>
            {unknownBarcode ? `📡 New scan — Barcode: ${unknownBarcode}` : "Add New Item"}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            {[
              ["Name",         "name",       "text",   180],
              ["Barcode",      "barcode",    "text",   140],
              ["Qty",          "qty",        "number",  70],
              ["Expiry (days)","expiryDays", "number",  90],
              ["Icon (emoji)", "icon",       "text",    60],
            ].map(([label, key, type, w]) => (
              <div key={key}>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{label}</div>
                <input type={type} value={unknownBarcode && key === "barcode" ? unknownBarcode : newItem[key]}
                  readOnly={unknownBarcode && key === "barcode"}
                  onChange={(e) => setNewItem((p) => ({ ...p, [key]: type === "number" ? +e.target.value : e.target.value }))}
                  style={{ width: w, background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "8px 10px", color: "#e2e8f0", fontSize: 13, outline: "none" }}
                />
              </div>
            ))}
            <button onClick={unknownBarcode ? handleUnknownSave : handleAdd}
              style={{ padding: "8px 20px", background: "#22c55e", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
              Save
            </button>
            <button onClick={() => { setAdding(false); setUnknownBarcode(null); }}
              style={{ padding: "8px 16px", background: "#1e293b", border: "none", borderRadius: 8, color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#475569" }}>Loading from database…</div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: 40, color: "#ef4444" }}>⚠ {error} — is the backend running?</div>
      ) : (
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
              {items.map((item) => (
                <tr key={item._id} style={{ borderBottom: "1px solid #1e293b", transition: "background 0.15s" }}
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
                      <button onClick={() => handleQty(item._id, -1)} style={{ width: 22, height: 22, borderRadius: 6, background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>−</button>
                      <span style={{ fontSize: 13, color: "#e2e8f0", minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                      <button onClick={() => handleQty(item._id, 1)} style={{ width: 22, height: 22, borderRadius: 6, background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>+</button>
                    </div>
                  </td>
                  <td style={{ padding: "13px 18px" }}>
                    {item.qty === 0 ? (
                      <span style={{ fontSize: 12, color: "#ef4444", fontWeight: 600 }}>Out of stock</span>
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 700, color: expiryColor(item.expiryDays), background: expiryColor(item.expiryDays) + "22", padding: "3px 10px", borderRadius: 20 }}>
                        {expiryLabel(item.expiryDays)}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "13px 18px" }}>
                    <code style={{ fontSize: 11, color: "#475569", background: "#1e293b", padding: "3px 8px", borderRadius: 6 }}>{item.barcode}</code>
                  </td>
                  <td style={{ padding: "13px 18px" }}>
                    <button onClick={() => handleDelete(item._id, item.name)}
                      style={{ padding: "5px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 7, color: "#ef4444", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#475569", fontSize: 14 }}>No items found</div>
          )}
        </div>
      )}
    </div>
  );
}
