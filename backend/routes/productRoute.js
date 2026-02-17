const express = require("express");
const router = express.Router();

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getProducts);
router.get("/:id", getProductById);

// Remove admin check, keep protect if we want only logged in users to edit, or just make it public if "admin part" is gone.
// Usually users don't edit products. I will keep them but remove admin check.
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
