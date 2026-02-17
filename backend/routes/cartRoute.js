const express = require("express");
const router = express.Router();
const { getCart, addToCart, removeFromCart, clearCart, productStatus } = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getCart)
router.post("/add", protect, addToCart)
router.delete("/remove/:id", protect, removeFromCart)
router.delete("/clear", protect, clearCart)

router.get("/productStatus", protect, productStatus)
module.exports = router
