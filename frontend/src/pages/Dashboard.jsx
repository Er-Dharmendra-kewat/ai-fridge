import { useEffect, useState } from "react";
import { getItems } from "../services/api";

const expiryColor = (days) => {
  if (days <= 1) return "#ef4444";
  if (days <= 2) return "#f97316";
  if (days <= 5) return "#eab308";
  return "#22c55e";
};

// 🔥 HELPER → handles qty OR quantity
const getQty = (item) => item.qty ?? item.quantity ?? 0;

// 🔥 GREETING FUNCTION
function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}

function MiniBar({ data, color }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32 }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: `${(v / max) * 100}%`,
            background: color,
            borderRadius: 2
          }}
        />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [greeting, setGreeting] = useState(getGreeting());

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getItems();
        setItems(data);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    fetchData();
  }, []);

  // 🔥 AUTO UPDATE GREETING EVERY MINUTE
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // 🔥 CALCULATIONS
  const total = items.filter(i => getQty(i) > 0).length;

  const expiring = items.filter(
    i => getQty(i) > 0 && i.expiryDays <= 3
  ).length;

  const outOfStock = items.filter(
    i => getQty(i) === 0
  ).length;

  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", paddingBottom: 40 }}>

      {/* HEADER */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f8fafc" }}>
          {greeting}! 👋
        </h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>
          Here's what's happening in your smart fridge today.
        </p>
      </div>

      {/* STATS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
        marginBottom: 28
      }}>
        {[
          { label: "Total Items", value: total, color: "#38bdf8" },
          { label: "Expiring Soon", value: expiring, color: "#f97316" },
          { label: "Out of Stock", value: outOfStock, color: "#ef4444" }
        ].map((s) => (
          <div key={s.label} style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 16,
            padding: 20
          }}>
            <div style={{ fontSize: 34, fontWeight: 900, color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>

        {/* INVENTORY PREVIEW */}
        <div style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 16,
          padding: 20
        }}>
          <div style={{ color: "#94a3b8", marginBottom: 16 }}>
            Inventory Preview
          </div>

          {items.length === 0 ? (
            <div style={{ color: "#64748b" }}>No items found</div>
          ) : (
            items
              .sort((a, b) => a.expiryDays - b.expiryDays)
              .slice(0, 6)
              .map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid #1e293b"
                  }}
                >
                  <div>
                    <div style={{ color: "#e2e8f0", fontWeight: 600 }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      {item.category || "General"}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>
                      ×{getQty(item)}
                    </span>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: expiryColor(item.expiryDays)
                      }}
                    />
                  </div>
                </div>
              ))
          )}
        </div>

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* ALERTS */}
          <div style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 16,
            padding: 20
          }}>
            <div style={{ color: "#94a3b8", marginBottom: 10 }}>
              Active Alerts
            </div>

            {items
              .filter(i => i.expiryDays <= 3)
              .slice(0, 3)
              .map((i) => (
                <div key={i._id} style={{ fontSize: 12, marginBottom: 6 }}>
                  {i.name} — expires in {i.expiryDays} days
                </div>
              ))}
          </div>

          {/* GRAPH */}
          <div style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 16,
            padding: 20
          }}>
            <div style={{ color: "#94a3b8", marginBottom: 10 }}>
              This Week
            </div>

            <MiniBar
              data={items.map(i => getQty(i))}
              color="#38bdf8"
            />
          </div>

        </div>
      </div>
    </div>
  );
}