const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
      default: "General",
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    discount: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      default: 50,
    },
    description: {
      type: String,
      default: "",
    },
    tag: {
      type: String,
      default: "",
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    sellerName: {
      type: String,
      default: "ShopMate Direct",
    },
    sellerRating: {
      type: Number,
      default: 4.8,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
