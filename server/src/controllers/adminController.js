const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const Vendor = require("../models/Vendor");
const mongoose = require("mongoose");
const { checkRegistration } = require("../utils/registration");

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getAdminStats = async (req, res) => {
  try {
    const [totalProducts, totalCustomers, totalOrders, pendingOrders, pendingSellersCount, revenueRows] =
      await Promise.all([
        Product.countDocuments(),
        User.countDocuments({ role: "customer" }),
        Order.countDocuments({ orderStatus: { $ne: "Cancelled" } }),
        Order.countDocuments({ orderStatus: "Processing" }),
        User.countDocuments({ role: "vendor", vendorStatus: "pending" }),
        Order.aggregate([
          { $match: { paymentStatus: "Paid" } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
      ]);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalCustomers,
        totalOrders,
        pendingOrders,
        totalRevenue: revenueRows[0]?.total || 0,
        pendingSellersCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @route   GET /api/admin/sellers/:id/document
exports.getSellerDocument = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid seller id" });
    }
    const seller = await User.findOne({ _id: req.params.id, role: "vendor" }).select("+documentFile documentFileName");
    if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });
    if (!seller.documentFile) {
      return res.status(404).json({ success: false, message: "No document was uploaded with this application" });
    }
    res.json({ success: true, fileName: seller.documentFileName, dataUrl: seller.documentFile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/admin/sellers/:id/verify-registration
exports.verifySellerRegistration = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid seller id" });
    }
    const seller = await User.findOne({ _id: req.params.id, role: "vendor" });
    if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });
    if (!seller.registrationNumber || !checkRegistration(seller.registrationNumber).valid) {
      return res.status(400).json({
        success: false,
        message: "This application has no valid registration number, so it cannot be verified. Ask the seller to apply again.",
      });
    }
    seller.registrationVerified = true;
    seller.registrationVerifiedAt = new Date();
    await seller.save();
    res.json({ success: true, verifiedAt: seller.registrationVerifiedAt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Seller Applications (Admin)
// @route   GET /api/admin/sellers
// @access  Private (Admin only)
exports.getSellerApplications = async (req, res) => {
  try {
    const sellers = await User.find({ role: "vendor" }).sort({ createdAt: -1 });
    // Add what the number tells us (state, PAN, business type), so the admin can see it
    const data = sellers.map((s) => ({
      ...s.toObject(),
      registrationInfo: s.registrationNumber ? checkRegistration(s.registrationNumber) : null,
    }));
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve Seller Application (Admin)
// @route   PUT /api/admin/sellers/:id/approve
// @access  Private (Admin only)
exports.approveSeller = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller account not found" });
    }

    if (seller.role !== "vendor") {
      return res.status(400).json({ success: false, message: "User is not registered as a vendor" });
    }
        // A seller can only be approved after the admin checked the registration number on the official portal
    if (!seller.registrationVerified) {
      return res.status(400).json({
        success: false,
        message: "Verify this seller's GSTIN / Udyam number on the official portal first: open 'View File Proof', check it, and click 'Mark as verified'.",
      });
    }

    seller.vendorStatus = "approved";
    seller.rejectionReason = "";
    await seller.save();

    // Create the seller's store profile on first approval (needed to list products)
    let vendor = await Vendor.findOne({ user: seller._id });
    if (!vendor) {
      const storeName = seller.businessName || `${seller.name}'s Store`;
      const base = storeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || "store";
      await Vendor.create({
        user: seller._id,
        storeName,
        slug: `${base}-${seller._id.toString().slice(-5)}`,
        description: `Official store of ${storeName}.`,
        contactEmail: seller.email,
        phone: seller.phone || "",
      });
    } else {
      vendor.isApproved = true;
      await vendor.save();
    }

    res.json({
      success: true,
      message: `Seller application for '${seller.businessName || seller.name}' has been APPROVED!`,
      data: seller,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Reject Seller Application (Admin)
// @route   PUT /api/admin/sellers/:id/reject
// @access  Private (Admin only)
exports.rejectSeller = async (req, res) => {
  try {
    const { reason } = req.body;
    const seller = await User.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller account not found" });
    }

    if (seller.role !== "vendor") {
      return res.status(400).json({ success: false, message: "User is not registered as a vendor" });
    }

    seller.vendorStatus = "rejected";
    seller.rejectionReason = reason || "Application does not meet current platform merchant verification standards.";
    await seller.save();
    await Vendor.updateOne({ user: seller._id }, { isApproved: false });

    res.json({
      success: true,
      message: `Seller application for '${seller.businessName || seller.name}' has been REJECTED.`,
      data: seller,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get All Products (Admin)
// @route   GET /api/admin/products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new product (Admin)
// @route   POST /api/admin/products
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/admin/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/admin/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Orders (Admin)
// @route   GET /api/admin/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Order Status (Admin)
// @route   PUT /api/admin/orders/:id
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

       const VALID = ["Processing", "Shipped", "Delivered", "Cancelled"];
    if (orderStatus && !VALID.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: "Invalid order status" });
    }
    if (orderStatus && orderStatus !== order.orderStatus) {
      if (order.orderStatus === "Cancelled") {
        return res.status(400).json({ success: false, message: "A cancelled order cannot be changed" });
      }
      order.orderStatus = orderStatus;
      order.statusHistory.push({ status: orderStatus, at: new Date() });
      if (orderStatus === "Cancelled") order.cancelledAt = new Date();
      if (orderStatus === "Delivered" && order.paymentMethod === "COD") order.paymentStatus = "Paid";
    }
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
