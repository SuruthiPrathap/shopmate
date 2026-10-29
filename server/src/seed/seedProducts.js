// Loads the products into MongoDB.   Run:  npm run seed      (check only: npm run seed -- --dry)
//
// Products live in small text files, one per category:  server/src/seed/catalog/footwear.txt, mobiles.txt ...
// ONE PRODUCT PER LINE:   Name | Price | Subcategory | Seller (can be empty) | Image link
// The file name is the category (footwear.txt -> Footwear). A new file such as home.txt adds a new category.
// Rating, reviews, discount and description are filled in automatically (same values every run).
// Image: a photo link, or the word  auto  to draw a picture for the product.
require("node:dns").setServers(["8.8.8.8", "1.1.1.1"]);
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const { makeAutoImage } = require("./icons");

const DRY = process.argv.includes("--dry");
const DIR = path.join(__dirname, "catalog");
const TAGS = ["Bestseller", "Trending", "Top Rated", "New Arrival", "", "Hot Deal"];

const SELLER_RATINGS = {
  "Nike Official Store": 4.9,
  "ShopMate Direct": 4.8,
  "Puma India Direct": 4.75,
  "Apple Authorised Reseller": 4.95,
  "Samsung Galaxy Experience": 4.8,
  "Sony Audio & Vision Flagship": 4.85,
  "Minimalist Skincare Hub": 4.8
};

const DESCRIPTIONS = {
  "Sofas & Chairs": "Comfortable seating with a sturdy frame and soft cushioning for everyday use.",
  "Beds": "Strong, well-built bed with a comfortable finish, made for restful sleep.",
  "Tables & Desks": "Sturdy table with a smooth finish, great for work, meals and daily use.",
  "Wardrobes & Storage": "Roomy storage with a neat finish that keeps your space organised.",
  "Shelves & Racks": "Sturdy shelving that displays and stores your things neatly.",
  "Toys & Games": "Safe, colourful and fun, made to keep kids learning and playing.",
  "Baby Care": "Gentle, trusted baby essentials made with a baby's delicate needs in mind.",
  "Kids Clothing": "Soft, breathable and easy-care clothing that keeps kids comfortable all day.",
  "School Supplies": "Durable school essentials designed for daily use by students.",
  "Baby Gear": "Safe, sturdy gear that makes life easier for parents and babies.",
  "Men's Running": "Cushioned and lightweight, built for daily runs and gym sessions.",
  "Women's Sneakers": "Comfortable everyday sneakers with a soft sole and stylish look.",
  "Kids Footwear": "Soft, durable and easy to wear, made for active kids.",
  "Formal Leather": "Classic formal design with a comfortable fit for office and events.",
  "Sports & Trekking": "Strong grip and sturdy build for trails and outdoor use.",
  "5G Flagships": "Premium 5G smartphone with a fast processor, great camera and bright display.",
  "Budget Mobiles": "Value-for-money smartphone with a long battery life and smooth performance.",
  "Smartwatches": "Smartwatch with health tracking, Bluetooth calling and many sports modes.",
  "Mobile Accessories": "Reliable accessory for everyday phone use, built to last.",
  "Headphones & Earbuds": "Clear sound, comfortable fit and long battery life for music and calls.",
  "Gaming Gear": "Responsive and durable gear for a smoother gaming experience.",
  "Laptops & Monitors": "Dependable performance for study, work and entertainment.",
  "Men's Clothing": "Comfortable fabric with a modern fit for everyday wear.",
  "Women's Wear": "Stylish and comfortable outfit for daily wear and occasions.",
  "Backpacks & Luggage": "Spacious, strong and designed for travel and daily carrying.",
  "Sunglasses": "UV protection with a stylish frame for sunny days.",
  "Kitchen Appliances": "Makes everyday cooking quicker, easier and safer.",
  "Air Fryers": "Cook crispy food with little or no oil, with easy digital controls.",
  "Home Essentials": "Useful home appliance with dependable performance and good energy efficiency.",
  "Facial Serums": "Lightweight serum that helps with glow, hydration and even-looking skin.",
  "Skincare": "Gentle daily skincare that keeps skin fresh, clean and moisturised.",
  "Grooming": "Easy-to-use grooming essential for a clean, confident look.",
  "Fitness Equipment": "Durable equipment for home workouts and gym training.",
  "Sportswear": "Breathable, stretchable sportswear for training and workouts."
};

const titleCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function buildProduct(category, fields, index) {
  const [name, priceText, subcategory, seller, image] = fields;
  const price = Number(priceText);
  const h = parseInt(crypto.createHash("md5").update(name).digest("hex").slice(0, 12), 16);
  const pct = 10 + (h % 46);
  const sellerName = seller || "ShopMate Store";
  const isAuto = image === "auto";
  const finalImage = isAuto ? makeAutoImage(subcategory, name) : image;
  return {
    name,
    category,
    subcategory: subcategory || "General",
    price,
    originalPrice: Math.round(price / (1 - pct / 100)),
    discount: `${pct}% OFF`,
    rating: Math.round((3.9 + (Math.floor(h / 7) % 10) / 10) * 10) / 10,
    reviewsCount: 120 + (Math.floor(h / 13) % 4500),
    image: finalImage,
    images: isAuto ? [finalImage] : [], // one picture only, so the product page shows no unrelated photos
    tag: TAGS[index % TAGS.length],
    description: `${name} - ${DESCRIPTIONS[subcategory] || `quality ${category.toLowerCase()} product with fast delivery and easy returns.`}`,
    sellerName,
    sellerRating: SELLER_RATINGS[sellerName] || 4.5,
  };
}

function loadCatalog() {
  const products = [];
  const names = new Set();
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".txt")).sort();
  for (const file of files) {
    const category = titleCase(file.replace(/\.txt$/, ""));
    const lines = fs.readFileSync(path.join(DIR, file), "utf8").split(/\r?\n/);
    let index = 0;
    lines.forEach((raw, i) => {
      const line = raw.trim();
      if (!line || line.startsWith("#")) return;
      const f = line.split("|").map((s) => s.trim());
      const problem =
        f.length < 5 ? "needs 5 parts: Name | Price | Subcategory | Seller | Image link"
        : !f[0] ? "name is empty"
        : !(Number(f[1]) > 0) ? "price must be a number like 1999"
        : !(f[4] === "auto" || /^(https?:\/\/|\/)/.test(f[4])) ? "image must be a link starting with https:// (or the word auto)"
        : names.has(f[0].toLowerCase()) ? "this product name is already used"
        : null;
      if (problem) return console.warn(`  SKIPPED ${file} line ${i + 1}: ${problem}`);
      names.add(f[0].toLowerCase());
      products.push(buildProduct(category, f, index++));
    });
  }
  return products;
}

(async () => {
  const products = loadCatalog();
  const count = {};
  products.forEach((p) => (count[p.category] = (count[p.category] || 0) + 1));
  console.log("Products per category:", count);

  // Check every product against the database rules (no connection needed)
  const results = await Promise.all(products.map((p) => new Product(p).validate().then(() => null, () => p.name)));
  const bad = results.filter(Boolean);
  if (bad.length) return console.error("Invalid products:", bad.join(", "));

  if (DRY) return console.log(`Dry run OK: ${products.length} products are ready. Nothing was saved.`);

  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopmate");
  // Only the base catalog is replaced. Vendor products and bulk-uploaded photos are kept.
  const removed = await Product.deleteMany({ vendor: { $exists: false }, source: { $ne: "bulk" } });
  // Insert reversed so the first line of a file shows first on the website
  await Product.insertMany([...products].reverse());
  console.log(`Removed ${removed.deletedCount} old products, added ${products.length} products.`);
})()
  .catch((err) => { console.error("Seed failed:", err.message); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());