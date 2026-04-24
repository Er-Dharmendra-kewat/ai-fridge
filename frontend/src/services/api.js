const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  return data.data || data;
}

// ITEMS
export const getItems = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request("GET", `/items${qs ? "?" + qs : ""}`);
};

export const addItem = (item) => request("POST", "/items", item);
export const updateItem = (id, data) => request("PATCH", `/items/${id}`, data);
export const deleteItem = (id) => request("DELETE", `/items/${id}`);
export const scanBarcode = (barcode) => request("POST", "/items/scan", { barcode });