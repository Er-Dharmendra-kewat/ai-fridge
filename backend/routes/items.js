import express from "express";
import Item from "../models/Item.js"; // ⚠️ add .js

const router = express.Router();

// ── GET /api/items ─────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.expiring === "true") {
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      filter.expiry = { $lte: threeDaysFromNow };
    }

    const items = await Item.find(filter).sort({ expiry: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items", details: err.message });
  }
});

// ── GET /api/items/:id ─────────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch item", details: err.message });
  }
});

// ── POST /api/items ────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const item = new Item(req.body);
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Barcode already exists" });
    }
    res.status(400).json({ error: "Failed to create item", details: err.message });
  }
});

// ── PUT /api/items/:id ─────────────────────────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: "Failed to update item", details: err.message });
  }
});

// ── DELETE /api/items/:id ──────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json({ message: "Item deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item", details: err.message });
  }
});

export default router;