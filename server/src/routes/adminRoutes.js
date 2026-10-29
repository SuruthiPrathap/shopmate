const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  getSellerApplications,
  approveSeller,
  rejectSeller,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getSellerDocument,
  verifySellerRegistration,
} = require("../controllers/adminController");
const { authenticateUser, requireRole } = require("../middleware/authMiddleware");

// All routes in this router require authentication & admin role
router.use(authenticateUser);
router.use(requireRole("admin"));

// Stats
router.get("/stats", getAdminStats);

// Seller Applications Management (Admin Approval Flow)
router.get("/sellers", getSellerApplications);
router.put("/sellers/:id/approve", approveSeller);
router.put("/sellers/:id/reject", rejectSeller);

// Products Management
router.get("/products", getAllProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.get("/sellers/:id/document", getSellerDocument);
router.put("/sellers/:id/verify-registration", verifySellerRegistration);

// Orders Management
router.get("/orders", getAllOrders);
router.put("/orders/:id", updateOrderStatus);

module.exports = router;
