const express = require("express");
const Product = require("../models/Product.model");
const Order = require("../models/Order.model");
const { requireAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/stats", requireAdmin, async (req, res, next) => {
  try {
    const [revenueAgg, activeOrders, lowStock] = await Promise.all([
      Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: "$total" } } }]),
      Order.countDocuments({ status: { $in: ["pending", "processing", "shipped"] } }),
      Product.countDocuments({ stock: { $lt: 15 } })
    ]);

    return res.json({
      totalRevenue: revenueAgg[0]?.totalRevenue || 0,
      activeOrders,
      lowStockAlerts: lowStock
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
