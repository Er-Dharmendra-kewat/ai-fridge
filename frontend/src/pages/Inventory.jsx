import { useState, useEffect, useCallback } from "react";
import { getItems, addItem, updateItem, deleteItem } from "../services/api";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);

  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    expiryDays: 7,
    category: "Dairy",
    barcode: ""
  });

  // FETCH ITEMS
  const fetchItems = useCallback(async () => {
    const data = await getItems();
    setItems(data);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // ADD ITEM
  const handleAdd = async () => {
    if (!newItem.name) return alert("Enter item name");

    await addItem(newItem);

    setNewItem({
      name: "",
      quantity: 1,
      expiryDays: 7,
      category: "",
      barcode: ""
    });

    setAdding(false);
    fetchItems();
  };

  // DELETE
  const handleDelete = async (id) => {
    await deleteItem(id);
    setItems(prev => prev.filter(i => i._id !== id));
  };

  // + / -
  const handleQty = async (id, delta) => {
    const item = items.find(i => i._id === id);
    if (!item) return;

    const newQty = Math.max(0, (item.quantity || 0) + delta);

    console.log("Updating:", id, newQty); // 👈 DEBUG

    try {
      const res = await updateItem(id, { quantity: newQty });
      console.log("Response:", res); // 👈 DEBUG

      setItems(prev =>
        prev.map(i =>
          i._id === id ? { ...i, quantity: newQty } : i
        )
      );
    } catch (err) {
      console.error("Update failed:", err);
    }
  };
  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 30, color: "#fff" }}>

      <h2 style={{ marginBottom: 5 }}>Inventory</h2>
      <p style={{ color: "#64748b", marginBottom: 20 }}>
        Live data from MongoDB — updates in real-time via the scanner.
      </p>

      {/* SEARCH + ADD */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #1e293b",
            background: "#020817",
            color: "#fff"
          }}
        />

        <button style={addBtn} onClick={() => setAdding(true)}>
          + Add Item
        </button>
      </div>

      {/* ADD FORM */}
      {adding && (
        <div style={card}>
          <input
            placeholder="Name"
            value={newItem.name}
            onChange={(e) =>
              setNewItem({ ...newItem, name: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="Barcode"
            value={newItem.barcode}
            onChange={(e) =>
              setNewItem({ ...newItem, barcode: e.target.value })
            }
            style={inputStyle}
          />

          <input
            type="number"
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({ ...newItem, quantity: +e.target.value })
            }
            style={inputStyle}
          />

          <select
            value={newItem.category}
            onChange={(e) =>
              setNewItem({ ...newItem, category: e.target.value })
            }
            style={inputStyle}
          >
            <option>Dairy</option>
            <option>Fruits</option>
            <option>Vegetables</option>
            <option>Bakery</option>
            <option>Meat</option>
            <option>Drinks</option>
          </select>

          <button onClick={handleAdd} style={addBtn}>
            Save
          </button>
        </div>
      )}

      {/* TABLE */}
      <div style={card}>
        <div style={headerRow}>
          <span>PRODUCT</span>
          <span>CATEGORY</span>
          <span>QTY</span>
          <span>EXPIRY</span>
          <span>BARCODE</span>
          <span>ACTIONS</span>
        </div>

        {filteredItems.map(item => (
          <div key={item._id} style={row}>

            <span>{item.name}</span>

            <span>
              <span style={badge}>{item.category || "General"}</span>
            </span>

            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => handleQty(item._id, -1)} style={qtyBtn}>-</button>

              <span>{item.quantity ?? 0}</span>

              <button onClick={() => handleQty(item._id, 1)} style={qtyBtn}>+</button>
            </span>

            <span style={{ color: "#22c55e" }}>
              {item.expiryDays} days
            </span>

            <span style={barcode}>
              {item.barcode || "—"}
            </span>

            <span>
              <button onClick={() => handleDelete(item._id)} style={deleteBtn}>
                Delete
              </button>
            </span>

          </div>
        ))}
      </div>
    </div>
  );
}

/* STYLES */

const card = {
  background: "#0f172a",
  borderRadius: 16,
  padding: 20,
  border: "1px solid #1e293b"
};

const headerRow = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 1fr 1.5fr 1fr",
  color: "#64748b",
  fontSize: 12,
  marginBottom: 10
};

const row = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 1fr 1.5fr 1fr",
  alignItems: "center",
  padding: "12px 0",
  borderTop: "1px solid #1e293b"
};

const badge = {
  padding: "4px 10px",
  borderRadius: 999,
  background: "#020817",
  border: "1px solid #334155",
  fontSize: 12
};

const qtyBtn = {
  background: "#020817",
  border: "1px solid #334155",
  color: "#fff",
  borderRadius: 6,
  width: 28,
  height: 28,
  cursor: "pointer"
};

const deleteBtn = {
  background: "transparent",
  border: "1px solid #ef4444",
  color: "#ef4444",
  padding: "5px 10px",
  borderRadius: 8,
  cursor: "pointer"
};

const addBtn = {
  background: "#38bdf8",
  border: "none",
  padding: "10px 16px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 600
};

const inputStyle = {
  marginRight: 10,
  padding: 10,
  borderRadius: 8,
  border: "1px solid #334155",
  background: "#020817",
  color: "#fff"
};

const barcode = {
  background: "#020817",
  padding: "4px 8px",
  borderRadius: 6,
  fontSize: 12,
  color: "#64748b"
};