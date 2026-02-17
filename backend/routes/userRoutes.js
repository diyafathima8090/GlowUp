const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUserById,
  updateUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

router.get("/:id", protect, getUserById);
router.patch("/:id", protect, updateUser);

module.exports = router;
