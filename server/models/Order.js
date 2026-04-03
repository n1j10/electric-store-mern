const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    variant: { type: String, default: "Standard" }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, trim: true },
    items: [orderItemSchema],
    shipping: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      method: { type: String, enum: ["standard", "express"], default: "standard" },
      cost: { type: Number, min: 0, default: 0 }
    },
    payment: {
      method: { type: String, enum: ["card", "paypal", "cod"], required: true },
      last4: { type: String, default: "" }
    },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered"],
      default: "pending"
    },
    estimatedArrival: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
