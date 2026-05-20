// const express = require("express");
// const router = express.Router();
// const upload = require("../middleware/uploadMiddleware");

// const {
//     getProducts,
//     getProductById,
//     getStockStatus,
//     createProduct,
//     updateProduct,
//     deleteProduct
// } = require("../controllers/productController");
// const { protect } = require("../middleware/authMiddleware");

// router.get("/", getProducts);
// router.get("/:id", getProductById);
// router.get("/stock-total'",getStockStatus);

// router.post("/", protect, upload.single("image"), createProduct);
// router.put("/:id", protect, upload.single("image"), updateProduct);
// router.delete("/:id", protect, deleteProduct);

// module.exports = router;

const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const {
    getProducts,
    getProductById,
    createProduct,
    getCatogery,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

// 1. Static routes first
router.get("/", getProducts);
// router.get("/stock-total", getStockStatus);

// 2. Dynamic routes (with :id) second
router.get("/stock-category",getCatogery)
router.get("/:id", getProductById); // ✅ MOVED DOWN

router.post("/", protect, upload.single("image"), createProduct);
router.put("/:id", protect, upload.single("image"), updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
