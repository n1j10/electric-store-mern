const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

function randomAlpha(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function generateOrderId() {
  const blockA = String(Math.floor(10000 + Math.random() * 90000));
  const blockB = randomAlpha(3);
  return `#TA-${blockA}-${blockB}`;
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function etaDate(method) {
  const now = new Date();
  const days = method === "express" ? 2 : 5;
  const start = new Date(now);
  const end = new Date(now);
  start.setDate(start.getDate() + days);
  end.setDate(end.getDate() + days + 2);

  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  return `${fmt.format(start)}-${fmt.format(end)}`;
}

router.post("/", async (req, res, next) => {
  try {
    const { items = [], shipping = {}, payment = {} } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must include at least one item." });
    }

    const productIds = items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productById = new Map(products.map((product) => [String(product._id), product]));

    const normalizedItems = [];
    for (const item of items) {
      const product = productById.get(String(item.product));
      if (!product) {
        return res.status(400).json({ message: `Invalid product: ${item.product}` });
      }
      const quantity = Math.max(Number(item.quantity) || 1, 1);
      normalizedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
        variant: item.variant || "Standard"
      });
    }

    const subtotal = round2(
      normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );

    const method = shipping.method === "express" ? "express" : "standard";
    const shippingCost = method === "express" ? 25 : 0;
    const taxRate = Number(process.env.TAX_RATE || 0.08);
    const tax = round2(subtotal * taxRate);
    const total = round2(subtotal + tax + shippingCost);

    const order = await Order.create({
      orderId: generateOrderId(),
      items: normalizedItems,
      shipping: {
        fullName: shipping.fullName || "",
        street: shipping.street || "",
        city: shipping.city || "",
        postalCode: shipping.postalCode || "",
        method,
        cost: shippingCost
      },
      payment: {
        method: payment.method || "card",
        last4: payment.last4 || ""
      },
      subtotal,
      tax,
      total,
      status: "pending",
      estimatedArrival: etaDate(method)
    });

    return res.status(201).json(order);
  } catch (error) {
    return next(error);
  }
});

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const order =
      mongoose.Types.ObjectId.isValid(id) ? await Order.findById(id) : await Order.findOne({ orderId: id });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.json(order);
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body || {};
    const validStatus = ["pending", "processing", "shipped", "delivered"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
