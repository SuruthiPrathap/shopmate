const express = require("express");
const router = express.Router();
const {
  getAllVendors,
  getVendorByIdentifier,
  getVendorDashboard,
  addVendorProduct,
  deleteVendorProduct,
} = require("../controllers/vendorController");
const {
  authenticateUser,
  requireRole,
  requireApprovedVendor,
} = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllVendors);
router.get("/:identifier", getVendorByIdentifier);

// Protected Approved Vendor Dashboard & Product Creation
// Must pass authenticateUser -> requireRole("vendor") -> requireApprovedVendor
router.get(
  "/me/dashboard",
  authenticateUser,
  requireRole("vendor"),
  requireApprovedVendor,
  getVendorDashboard
);

router.post(
  "/products",
  authenticateUser,
  requireRole("vendor"),
  requireApprovedVendor,
  addVendorProduct
);

router.delete(
  "/products/:id",
  authenticateUser,
  requireRole("vendor"),
  requireApprovedVendor,
  deleteVendorProduct
);

module.exports = router;
