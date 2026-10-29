const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    categoryKey: {
      type: String,
      required: true,
      unique: true,
    },
    icon: {
      type: String,
      default: "",
    },
    subcategories: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
