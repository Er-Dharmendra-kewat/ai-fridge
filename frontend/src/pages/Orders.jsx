import { useState } from "react";

const INITIAL_ITEMS = [
  { id: 1, name: "Orange Juice", qty: 0, expiry: null, icon: "🍊", price: "₹80" },
  { id: 2, name: "Whole Milk", qty: 1, expiry: "soon", icon: "🥛", price: "₹60" },
  { id: 3, name: "Baby Spinach", qty: 2, expiry: "today", icon: "🥬", price: "₹45" },
];

export default function Orders() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [ordered, setOrdered] = useState([]);

  const getReason = (item) => {
    if (item.qty === 0) return "Out of stock";
    if (item.expiry === "today") return "Expiring today";
    if (item.expiry === "soon") return "Expiring + Low qty";
    return "In stock";
  };

  const shouldOrder = (item) => {
    return item.qty === 0 || item.expiry;
  };

  const handleOrder = (id) => {
    setOrdered((prev) => [...prev, id]);

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: item.qty + 5, expiry: null }
          : item
      )
    );
  };

  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;
  
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
const handlePayment = async (item) => {
  const isLoaded = await loadRazorpay();

  if (!isLoaded) {
    alert("Razorpay failed to load ❌");
    return;
  }

  const amount = parseInt(item.price.replace("₹", "")) * 100;

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY,
    amount,
    currency: "INR",
    name: "Smart Fridge",
    description: item.name,

    handler: function () {
      alert("Payment Successful ✅");
      handleOrder(item.id);
    },

    modal: {
      ondismiss: function () {
        alert("Payment Cancelled ❌");
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

const handleOrderAll = async () => {
  const isLoaded = await loadRazorpay();

  if (!isLoaded) {
    alert("Razorpay failed to load ❌");
    return;
  }

  const itemsToOrder = items.filter(shouldOrder);

  if (itemsToOrder.length === 0) {
    alert("Nothing to order ✅");
    return;
  }

  const totalAmount =
    itemsToOrder.reduce(
      (sum, item) => sum + parseInt(item.price.replace("₹", "")),
      0
    ) * 100;

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY,
    amount: totalAmount,
    currency: "INR",
    name: "Smart Fridge",
    description: "Order All Items",

    handler: function () {
      alert("Payment Successful ✅");

      const ids = itemsToOrder.map((i) => i.id);
      setOrdered(ids);

      setItems((prev) =>
        prev.map((item) =>
          shouldOrder(item)
            ? { ...item, qty: item.qty + 5, expiry: null }
            : item
        )
      );
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

  return (
    <div style={{ padding: "0 0 40px" }}>
      <h1 style={{ color: "#fff" }}>Orders</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((o) => (
          <div
            key={o.id}
            style={{
              background: "#0f172a",
              padding: 16,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ fontSize: 24 }}>{o.icon}</div>

            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff" }}>{o.name}</div>
              <div style={{ color: "#aaa", fontSize: 12 }}>
                {getReason(o)}
              </div>
            </div>

            <div style={{ color: "#38bdf8" }}>{o.price}</div>

            {ordered.includes(o.id) ? (
              <span style={{ color: "green" }}>✓ Ordered</span>
            ) : shouldOrder(o) ? (
             <button
  onClick={() => handlePayment(o)}
  style={{
    padding: "8px 16px",
    background: "linear-gradient(135deg, #38bdf8, #818cf8)",
    border: "none",
    borderRadius: 8,
    color: "#0f172a",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  }}
>
  Order
</button>
            ) : (
              <span>In Stock</span>
            )}
          </div>
        ))}
      </div>

      <button
  onClick={handleOrderAll}
  style={{
    marginTop: 20,
    padding: "12px 28px",
    background: "linear-gradient(135deg, #22c55e, #4ade80)",
    border: "none",
    borderRadius: 10,
    fontWeight: 700,
    cursor: "pointer",
  }}
>
  Order All Items
</button>
    </div>
  );
}