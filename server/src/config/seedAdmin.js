const User = require("../models/User");

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@shopmate.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: "ShopMate Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        vendorStatus: null,
      });
      console.log(`[SEED] Hardcoded Admin account created successfully: ${adminEmail}`);
    }
  } catch (error) {
    console.error("[SEED] Error seeding admin account:", error.message);
  }
};

module.exports = seedAdmin;
