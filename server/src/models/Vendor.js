const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storeName: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&q=80",
    },
    banner: {
      type: String,
      default: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
    },
    contactEmail: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    commissionRate: {
      type: Number,
      default: 5, // 5% platform fee
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
