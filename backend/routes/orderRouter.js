const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, cancelOrder } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.delete("/:orderId", protect, cancelOrder);

module.exports = router;
