const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    specs: {
      processor: { type: String, default: "" },
      gpu: { type: String, default: "" },
      ram: { type: String, default: "" },
      storage: { type: String, default: "" },
      display: { type: String, default: "" },
      battery: { type: String, default: "" }
    },
    images: [{ type: String }],
    stock: { type: Number, required: true, min: 0, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 4.5 },
    reviewCount: { type: Number, min: 0, default: 0 },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", category: "text", brand: "text" });

module.exports = mongoose.model("Product", productSchema);
