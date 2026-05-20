const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user", enum: ["user", "admin", "manager"] },
    isBlocked: { type: Boolean, default: false },
    cart: { type: Array, default: [] },
    orders: { type: Array, default: [] },
  },
  { timestamps: true, collection: "users" }
);

module.exports = mongoose.model("User", userSchema);
