const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
                size: { type: String, default: "" },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "COD",
    },
        upiId: { type: String, default: "" },
    itemsTotal: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    statusHistory: [
      {
        status: { type: String },
        at: { type: Date, default: Date.now },
        _id: false,
      },
    ],
    cancelledAt: { type: Date },
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);