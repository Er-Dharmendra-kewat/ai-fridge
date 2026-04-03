import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    qty:      { type: Number, required: true, default: 1, min: 0 },
    expiry:   { type: Date, required: true },
    barcode:  { type: String, required: true, unique: true, trim: true },
    category: { type: String, default: "Other" },
    unit:     { type: String, default: "pcs" },
    icon:     { type: String, default: "📦" },
  },
  { timestamps: true }
);

// Virtual: days until expiry
itemSchema.virtual("expiryDays").get(function () {
  const now = new Date();
  const diff = this.expiry - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

// Include virtuals in JSON
itemSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Item", itemSchema);

