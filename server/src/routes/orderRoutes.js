const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, cancelOrder } = require("../controllers/orderController");
const { authenticateUser } = require("../middleware/authMiddleware");

router.post("/", authenticateUser, createOrder);
router.get("/mine", authenticateUser, getMyOrders);
router.put("/:id/cancel", authenticateUser, cancelOrder);

module.exports = router;