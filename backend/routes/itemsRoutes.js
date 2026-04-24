const express = require("express");
const router = express.Router();
const Item = require("../models/Item");


// 🔥 GET ITEMS (with search + category)
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category && category !== "All") {
      query.category = category;
    }

    const items = await Item.find(query);

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🔥 ADD ITEM (THIS IS WHAT SAVES TO DB)
router.post("/", async (req, res) => {
  try {
    console.log("POST /items hit:", req.body); // 🔥 DEBUG

    const { name, quantity, expiryDays, barcode, category } = req.body;

    const item = new Item({
      name,
      quantity: quantity ?? 1,
      expiryDays,
      barcode,
      category
    });

    await item.save(); // ✅ IMPORTANT

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🔥 UPDATE ITEM (FOR + / -)
router.patch("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🔥 DELETE ITEM
router.delete("/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;