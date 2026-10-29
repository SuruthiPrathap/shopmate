const mongoose = require("mongoose");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { getSizeOptions } = require("../utils/sizes");

const FREE_SHIPPING_ABOVE = 1000; // same rule as the cart drawer
const SHIPPING_FEE = 99;

// Builds a wa.me link: opens WhatsApp chat with the SHOP number and the order text pre-filled.
const buildWhatsappUrl = (order) => {
  const shopNumber = (process.env.SHOP_WHATSAPP || "").replace(/\D/g, "");
  if (!shopNumber) return null;

  const a = order.shippingAddress;
  const lines = order.orderItems.map((i) => `• ${i.name} x${i.quantity} - ₹${(i.price * i.quantity).toLocaleString("en-IN")}`);
  const text = [
    `*New ShopMate Order* #${order._id.toString().slice(-8).toUpperCase()}`,
    "",
    ...lines,
    "",
    `Items: ₹${order.itemsTotal.toLocaleString("en-IN")}`,
    `Delivery: ${order.shippingFee === 0 ? "FREE" : "₹" + order.shippingFee}`,
    `*Total: ₹${order.totalAmount.toLocaleString("en-IN")}* (${order.paymentMethod})`,
    "",
    `Name: ${a.fullName}`,
    `Phone: ${a.phone}`,
    `Address: ${a.street}, ${a.city}, ${a.state} - ${a.zipCode}`,
    "",
    "Please confirm my order. Thank you!",
  ].join("\n");

  return `https://wa.me/${shopNumber}?text=${encodeURIComponent(text)}`;
};

// @route POST /api/orders   (logged-in customer)
// body: { items: [{ productId, quantity }], shippingAddress: {...} }
exports.createOrder = async (req, res) => {
  try {
        const { items, shippingAddress: addr = {}, paymentMethod = "COD" } = req.body;

    if (!["COD", "UPI"].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: "Please choose Cash on Delivery or UPI" });
    }

    // For UPI the customer types their own UPI id (like name@okhdfcbank)
    const upiId = String(req.body.upiId || "").trim();
    if (paymentMethod === "UPI" && !/^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) {
      return res.status(400).json({ success: false, message: "Please enter a valid UPI ID, like name@okhdfcbank" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Your cart is empty" });
    }

    // Validate address
    const need = ["fullName", "phone", "street", "city", "state", "zipCode"];
    for (const f of need) {
      if (!addr[f] || !String(addr[f]).trim()) {
        return res.status(400).json({ success: false, message: `Please enter ${f}` });
      }
    }
    if (!/^\d{10}$/.test(String(addr.phone).replace(/\D/g, "").slice(-10))) {
      return res.status(400).json({ success: false, message: "Enter a valid 10 digit phone number" });
    }
    if (!/^\d{6}$/.test(String(addr.zipCode).trim())) {
      return res.status(400).json({ success: false, message: "Enter a valid 6 digit pincode" });
    }

    // Load real prices from the database (never trust prices sent by the browser)
    const ids = items.map((i) => i.productId);
    if (!ids.every((id) => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ success: false, message: "Some items are not available. Please refresh and try again." });
    }
    const products = await Product.find({ _id: { $in: ids } });
    const byId = new Map(products.map((p) => [p._id.toString(), p]));

    const orderItems = [];
    for (const it of items) {
      const p = byId.get(String(it.productId));
      const qty = Math.min(Math.max(parseInt(it.quantity, 10) || 1, 1), 10);
      if (!p) return res.status(400).json({ success: false, message: "A product in your cart no longer exists" });
      if (!p.inStock) return res.status(400).json({ success: false, message: `${p.name} is out of stock` });
           // Shoes and clothes need a size
      const sizeOptions = getSizeOptions(p);
      let size = "";
      if (sizeOptions) {
        size = String(it.size || "");
        if (!sizeOptions.includes(size)) {
          return res.status(400).json({ success: false, message: `Please select a size for ${p.name}` });
        }
      }
      orderItems.push({ product: p._id, name: p.name, image: p.image, size, price: p.price, quantity: qty });
    }

    const itemsTotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const shippingFee = itemsTotal > FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress: {
        fullName: addr.fullName.trim(),
        phone: String(addr.phone).replace(/\D/g, "").slice(-10),
        street: addr.street.trim(),
        city: addr.city.trim(),
        state: addr.state.trim(),
        zipCode: String(addr.zipCode).trim(),
        country: "India",
      },
      paymentMethod: "COD",
      upiId: paymentMethod === "UPI" ? upiId : "",
      statusHistory: [{ status: "Processing", at: new Date() }],
      itemsTotal,
      shippingFee,
      totalAmount: itemsTotal + shippingFee,
    });

    res.status(201).json({
      success: true,
      data: order,
      orderNumber: order._id.toString().slice(-8).toUpperCase(),
      whatsappUrl: buildWhatsappUrl(order),
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @route GET /api/orders/mine
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const CANCEL_WINDOW_HOURS = 24;

exports.cancelOrder = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid order id" });
    }
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({ success: false, message: "This order is already cancelled" });
    }
    if (order.orderStatus !== "Processing") {
      return res.status(400).json({
        success: false,
        message: `This order is already ${order.orderStatus.toLowerCase()} and can no longer be cancelled`,
      });
    }
    const hoursSince = (Date.now() - new Date(order.createdAt).getTime()) / 36e5;
    if (hoursSince > CANCEL_WINDOW_HOURS) {
      return res.status(400).json({
        success: false,
        message: `Orders can only be cancelled within ${CANCEL_WINDOW_HOURS} hours of placing them`,
      });
    }

    order.orderStatus = "Cancelled";
    order.cancelledAt = new Date();
    order.statusHistory.push({ status: "Cancelled", at: order.cancelledAt });
    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};