const express = require("express");
const router = express.Router();
const {
  registerUser,
  registerSeller,
  loginUser,
  getMe,
} = require("../controllers/authController");
const { authenticateUser } = require("../middleware/authMiddleware");

// Public endpoints
router.post("/register", registerUser);
router.post("/register-seller", registerSeller);
router.post("/login", loginUser);

// Protected endpoint
router.get("/me", authenticateUser, getMe);

module.exports = router;
