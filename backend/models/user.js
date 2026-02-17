const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" },
    cart: { type: Array, default: [] },
    orders: { type: Array, default: [] },
    wishlist: { type: Array, default: [] },
  },
  { timestamps: true, collection: "users" }
);

module.exports = mongoose.model("User", userSchema);
