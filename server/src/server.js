const dotenv = require("dotenv");
dotenv.config(); // load .env before anything reads process.env

// Custom DNS only for local dev (helps with Atlas SRV lookups on some networks)
if (process.env.NODE_ENV !== "production") {
  require("node:dns").setServers(["8.8.8.8", "1.1.1.1"]);
}

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const seedAdmin = require("./config/seedAdmin");

const app = express();

// CLIENT_URL = your Vercel site (comma separated for more than one). Empty = allow all (dev).
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim().replace(/\/$/, "")) // remove trailing slash
  .filter(Boolean);
app.use(cors(allowedOrigins.length ? { origin: allowedOrigins } : undefined));

// Serverless: make sure DB is connected before handling any request.
// Seeding the admin runs only once per server instance.
let seeded = false;
app.use(async (req, res, next) => {
  try {
    await connectDB();
    if (!seeded) {
      await seedAdmin();
      seeded = true;
    }
    next();
  } catch (err) {
    console.error("DB connection error:", err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

// The seller application carries a document photo, so this one route accepts a larger body
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

// Only listen locally. On Vercel the exported app is the serverless handler.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

