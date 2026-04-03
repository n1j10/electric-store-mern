const express = require("express");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { requireAdmin } = require("../middleware/auth");

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
