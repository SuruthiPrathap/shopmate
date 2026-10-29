require("node:dns").setServers(["8.8.8.8", "1.1.1.1"]);
const dotenv = require("dotenv");
dotenv.config(); // load .env before anything reads process.env

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const seedAdmin = require("./config/seedAdmin");

// Connect Database & Seed Admin
connectDB().then(() => {
  seedAdmin();
});

const app = express();

// CLIENT_URL = your Vercel site (comma separated for more than one). Empty = allow all (dev).
const allowedOrigins = (process.env.CLIENT_URL || "").split(",").map((s) => s.trim()).filter(Boolean);
app.use(cors(allowedOrigins.length ? { origin: allowedOrigins } : undefined));
// The seller application carries a document photo, so this one route accepts a larger body (6 MB)
app.use("/api/auth/register-seller", express.json({ limit: "6mb" }));
app.use(express.json());

// Mount Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/vendors", require("./routes/vendorRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

app.get("/", (req, res) => {
  res.send("ShopMate Marketplace API is running");
});
app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
