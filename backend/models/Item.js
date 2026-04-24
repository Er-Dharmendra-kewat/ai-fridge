const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: { type: Number, default: 1 }, // 🔥 important
  expiryDays: Number,
  barcode: String,
  category: { type: String, default: "General" }, // 🔥 for filter
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Item", itemSchema);