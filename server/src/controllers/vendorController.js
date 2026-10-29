const Vendor = require("../models/Vendor");
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");

// @desc    Get All Vendors
// @route   GET /api/vendors
// @access  Public
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ isApproved: true }).populate("user", "name email");
    res.json({ success: true, count: vendors.length, data: vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Vendor Details & Products by ID or Slug
// @route   GET /api/vendors/:identifier
// @access  Public
exports.getVendorByIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params;
    let vendor;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      vendor = await Vendor.findById(identifier).populate("user", "name email");
    } else {
      vendor = await Vendor.findOne({ slug: identifier }).populate("user", "name email");
    }

    if (!vendor) {
      return res.status(404).json({ message: "Vendor store not found" });
    }

    const products = await Product.find({ vendor: vendor._id });

    res.json({
      success: true,
      data: {
        vendor,
        productsCount: products.length,
        products,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Current Vendor's Dashboard Stats & Products
// @route   GET /api/vendors/me/dashboard
// @access  Private (Vendor only)
exports.getVendorDashboard = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }

    const products = await Product.find({ vendor: vendor._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        vendor,
        totalProducts: products.length,
        totalSales: vendor.totalSales,
        products,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a product as Vendor
// @route   POST /api/vendors/products
// @access  Private (Vendor only)
exports.addVendorProduct = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(403).json({ message: "Only registered vendors can add products" });
    }

    const { name, category, subcategory, price, originalPrice, discount, image, images, description, tag, stock } = req.body;
    const productData = {
      name, category, subcategory, price, originalPrice, discount, image, images, description, tag, stock,
      vendor: vendor._id,
      sellerName: vendor.storeName,
      sellerRating: vendor.rating,
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Product listed successfully under your store!",
      data: product,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete one of my products
// @route   DELETE /api/vendors/products/:id
// @access  Private (Approved vendor)
exports.deleteVendorProduct = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) return res.status(403).json({ success: false, message: "Vendor profile not found" });

    const product = await Product.findOneAndDelete({ _id: req.params.id, vendor: vendor._id });
    if (!product) return res.status(404).json({ success: false, message: "Product not found in your store" });

    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
