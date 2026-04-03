import React, { useState } from "react";

// Sample inventory data
const INITIAL_INVENTORY = [
  { id: 1, name: "Whole Milk", qty: 1, expiry: 1, barcode: "8939203", category: "Dairy", unit: "L", icon: "🥛" },
  { id: 2, name: "Free-Range Eggs", qty: 6, expiry: 5, barcode: "2039203", category: "Protein", unit: "pcs", icon: "🥚" },
  { id: 3, name: "Roma Tomatoes", qty: 3, expiry: 2, barcode: "1293823", category: "Vegetables", unit: "pcs", icon: "🍅" },
  { id: 4, name: "Aged Cheddar", qty: 1, expiry: 14, barcode: "3928102", category: "Dairy", unit: "block", icon: "🧀" },
  { id: 5, name: "Sourdough Bread", qty: 1, expiry: 3, barcode: "9182736", category: "Bakery", unit: "loaf", icon: "🍞" },
  { id: 6, name: "Baby Spinach", qty: 1, expiry: 1, barcode: "4728391", category: "Vegetables", unit: "bag", icon: "🥬" },
];

export default function Inventory() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [search, setSearch] = useState("");

  const handleAdd = () => {
    const newItem = {
      id: Date.now(),
      name: "New Item",
      qty: 1,
      expiry: 7,
      barcode: "000000",
      category: "Misc",
      unit: "pcs",
      icon: "🆕",
    };
    setInventory([newItem, ...inventory]);
  };

  const handleDelete = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const handleQtyChange = (id, delta) => {
    setInventory(inventory.map(item => item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item));
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f8fafc", marginBottom: 16 }}>Inventory</h1>

      {/* Search + Add */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 8,
            border: "1px solid #64748b",
            background: "#1e293b",
            color: "#f8fafc"
          }}
        />
        <button
          onClick={handleAdd}
          style={{ padding: "8px 16px", borderRadius: 8, background: "#38bdf8", color: "#0f172a", fontWeight: 700 }}
        >
          Add Item
        </button>
      </div>

      {/* Inventory Table */}
      <div style={{ background: "#0f172a", borderRadius: 12, padding: 16 }}>
        {filteredInventory.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No items found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b", color: "#94a3b8" }}>
                <th style={{ textAlign: "left", padding: "8px 0" }}>Item</th>
                <th>Qty</th>
                <th>Expiry</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map(item => (
                <tr key={item.id} style={{ borderBottom: "1px solid #1e293b", color: "#f8fafc" }}>
                  <td>{item.icon} {item.name}</td>
                  <td style={{ textAlign: "center" }}>
                    <button onClick={() => handleQtyChange(item.id, -1)} style={{ marginRight: 4 }}>-</button>
                    {item.qty}
                    <button onClick={() => handleQtyChange(item.id, 1)} style={{ marginLeft: 4 }}>+</button>
                  </td>
                  <td style={{ textAlign: "center" }}>{item.expiry} days</td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{ background: "#ef4444", color: "#f8fafc", borderRadius: 4, padding: "4px 8px" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}