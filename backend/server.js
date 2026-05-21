const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");
const orderRouter = require("./routes/orderRouter");
const wishlistRoute = require("./routes/wishlistRoute");
const adminRoutes = require("./routes/adminRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

connectDB();

app.use(cors({
   origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://glowup-frontend-wiue.onrender.com"
   ],
   credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRouter);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/admin", adminRoutes);

// 2. Add your base route right here! (BEFORE the error handlers)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "GlowUp Backend API is running successfully!"
  });
});

// 3. Catch-all fallback error handlers must be at the very bottom
app.use(notFound);
app.use(errorHandler);

// app.get("/", (req, res) => {
//    res.send("Backend API running 🚀");
// });
// Add this near your other routes
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "GlowUp Backend API is running successfully!"
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
   console.log(`Error: ${err.message}`);
   server.close(() => process.exit(1));
});
