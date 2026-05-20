const express = require("express");
const router = express.Router();
const { adminProtect } = require("../middleware/adminMiddleware");

const {
    getDashboardStats,
    getAllUsers,
    deleteUser,
    updateUser,
    getAllOrders,
    updateOrderStatus,
    getAllProducts,
} = require("../controllers/adminController");

router.get("/dashboard", adminProtect, getDashboardStats);
router.get("/users", adminProtect, getAllUsers);
router.patch("/users/:id", adminProtect, updateUser);
router.delete("/users/:id", adminProtect, deleteUser);
router.get("/orders", adminProtect, getAllOrders);
router.patch("/orders/:userId/:orderId", adminProtect, updateOrderStatus);
router.get("/products", adminProtect, getAllProducts);


module.exports = router;