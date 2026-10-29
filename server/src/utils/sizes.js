// Which products need a size, and which sizes are allowed.
// (Same rules as client/src/utils/sizes.js - keep both in sync.)
const SHOE_SIZES = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];
const CLOTHING_SIZES = ["S", "M", "L", "XL", "XXL"];
const KIDS_SIZES = ["0-1 Y", "1-2 Y", "2-3 Y", "4-5 Y", "6-7 Y", "8-9 Y"];

function getSizeOptions(product) {
  const category = product.category;
  const sub = (product.subcategory || "").toLowerCase();
  if (category === "Footwear") return SHOE_SIZES;
  if (category === "Fashion") {
    if (sub.includes("backpack") || sub.includes("sunglass")) return null;
    return CLOTHING_SIZES;
  }
  if (category === "Sports" && sub === "sportswear") return CLOTHING_SIZES;
  if (category === "Kids" && sub === "kids clothing") return KIDS_SIZES;
  return null; // no size needed
}

module.exports = { getSizeOptions };