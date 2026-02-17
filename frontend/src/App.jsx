import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Main Components
import Navbar from "./components/Navbar.jsx";

// Auth Pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// User Pages
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

// Authentication Protection
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();

  // Hide Navbar on login/register pages
  const hideNavbar = [
    "/login",
    "/register",
  ].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-pink-50">
      {!hideNavbar && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          <Route path="/products" element={<Products />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

export default App;
