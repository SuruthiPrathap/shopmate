const mongoose = require("mongoose");
const Product = require("../models/Product");

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @route GET /api/products   (public)  ?category=&q=&minPrice=&maxPrice=
exports.getProducts = async (req, res) => {
  try {
    const { category, q, minPrice, maxPrice } = req.query;
    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (q) filter.name = { $regex: escapeRegex(String(q)), $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const products = await Product.find(filter).sort({ createdAt: -1, _id: -1 }).limit(500);
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/products/:id   (public)
exports.getProductById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
