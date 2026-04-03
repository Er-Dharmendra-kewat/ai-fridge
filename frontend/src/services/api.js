// src/services/api.js
// All HTTP calls to the Express backend go through here.

const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "API error");
  return data.data;
}

// ── Items ──────────────────────────────────────────────────────────────────
export const getItems    = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request("GET", `/items${qs ? "?" + qs : ""}`);
};

export const getAlerts   = ()         => request("GET",    "/items/alerts");
export const getByBarcode = (barcode) => request("GET",    `/items/barcode/${barcode}`);
export const addItem     = (item)     => request("POST",   "/items", item);
export const scanBarcode = (barcode)  => request("POST",   "/items/scan", { barcode });
export const updateItem  = (id, data) => request("PATCH",  `/items/${id}`, data);
export const deleteItem  = (id)       => request("DELETE", `/items/${id}`);
