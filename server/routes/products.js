const express = require("express");
const Product = require("../models/Product");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

function toNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function buildSort(sort) {
  switch (sort) {
    case "price_asc":
      return { price: 1 };
    case "price_desc":
      return { price: -1 };
    case "rating_desc":
      return { rating: -1 };
    case "newest":
      return { createdAt: -1 };
    default:
      return { featured: -1, createdAt: -1 };
  }
}

router.get("/", async (req, res, next) => {
  try {
    const {
      search = "",
      category = "",
      brand = "",
      minPrice,
      maxPrice,
      sort = "",
      page = "1",
      limit = "9"
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (brand) {
      query.brand = brand;
    }

    const min = toNumber(minPrice, null);
    const max = toNumber(maxPrice, null);
    if (min !== null || max !== null) {
      query.price = {};
      if (min !== null) query.price.$gte = min;
      if (max !== null) query.price.$lte = max;
    }

    const currentPage = Math.max(toNumber(page, 1), 1);
    const pageLimit = Math.max(toNumber(limit, 9), 1);
    const skip = (currentPage - 1) * pageLimit;

    const [items, total] = await Promise.all([
      Product.find(query).sort(buildSort(sort)).skip(skip).limit(pageLimit),
      Product.countDocuments(query)
    ]);

    return res.json({
      items,
      pagination: {
        page: currentPage,
        limit: pageLimit,
        total,
        totalPages: Math.max(Math.ceil(total / pageLimit), 1)
      },
      filtersApplied: {
        search,
        category,
        brand,
        minPrice: min,
        maxPrice: max,
        sort
      }
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = /^[0-9a-fA-F]{24}$/.test(id)
      ? await Product.findById(id)
      : await Product.findOne({ slug: id });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    return res.json(product);
  } catch (error) {
    return next(error);
  }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const created = await Product.create(req.body);
    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) {
      return res.status(404).json({ message: "Product not found." });
    }
    return res.json(updated);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found." });
    }
    return res.json({ message: "Product deleted successfully." });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
