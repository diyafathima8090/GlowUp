import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Main Components
import Navbar from "./components/Navbar.jsx";

// Auth Pages (Lazy)
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));

// User Pages (Lazy)
const Home = lazy(() => import("./pages/Home.jsx"));
const Products = lazy(() => import("./pages/Products.jsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.jsx"));
const ProductDetails = lazy(() => import("./pages/ProductDetails.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const MyOrders = lazy(() => import("./pages/MyOrders.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));

// Authentication Protection

import ProtectedRoute from "./components/ProtectedRoute.jsx";

// ─── Admin (Lazy) ────────────────────────────────────────────────────────────

const AdminDashboard = lazy(() => import("./admin/AdminDashboard.jsx"));
const ProtectedAdminRoute = lazy(() => import("./admin/components/ProtectedAdminRoute.jsx"));
const DashboardHome = lazy(() => import("./admin/pages/DashbordHome.jsx"));
const ManageProduct = lazy(() => import("./admin/pages/ManageProduct.jsx"));
const ManageOrders = lazy(() => import("./admin/pages/ManageOrder.jsx"));
const ManageUsers = lazy(() => import("./admin/pages/ManageUser.jsx"));

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Premium Loading Spinner for Suspense
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-pink-600 font-medium animate-pulse tracking-widest uppercase text-xs">Enhancing your glow...</p>
  </div>
);

function App() {
  const location = useLocation();

  // Hide Navbar on login/register pages and all admin pages
  const hideNavbar =
    ["/login", "/register"].includes(location.pathname) ||
    location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-pink-50">
      {!hideNavbar && <Navbar />}

      <main className="flex-grow">
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* ─── Public Routes ──────────────────────────────────── */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:category/:id" element={<ProductDetails />} />

            {/* ─── Protected User Routes ──────────────────────────── */}
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

            {/* ─── Admin Routes ───────────────────────────────────── */}
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />}>
                <Route index element={<DashboardHome />} />
                <Route path="products" element={<ManageProduct />} />
                <Route path="orders" element={<ManageOrders />} />
                <Route path="users" element={<ManageUsers />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </main>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

export default App;
