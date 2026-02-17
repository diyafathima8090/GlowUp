import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { AiOutlineHeart } from "react-icons/ai";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { toast } from "react-toastify";

const Navbar = () => {
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const isHomePage = location.pathname === "/";
  const username = user?.email?.split("@")[0];
  const isLoggedIn = !!user;
  const wishlistCount = wishlist.length;
  const cartCount = cart.length;

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const handleProtectedNavigation = (e, path) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.warning(`Please login to access ${path}`);
      navigate("/login");
      setIsMenuOpen(false); // Close mobile menu if open
    }
  };

  useEffect(() => {
    if (!isHomePage) return;
    const handleScroll = () => setIsSticky(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${isHomePage
        ? isSticky
          ? "bg-[#FDECEF]/90 backdrop-blur-md shadow-md"
          : "bg-transparent"
        : "bg-[#FDECEF] shadow-md"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className={`text-3xl md:text-4xl font-extrabold tracking-wide ${isHomePage && !isSticky
            ? "text-white"
            : "text-transparent bg-clip-text bg-gradient-to-r from-[#FF9EBB] to-[#FF5C8D]"
            }`}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9EBB] to-[#FF5C8D]">
            Glow
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5C8D] to-[#FF9EBB]">
            Up
          </span>
        </Link>

        {/* Hamburger Menu */}
        <button
          className={`md:hidden text-2xl focus:outline-none ${isHomePage && !isSticky ? "text-white" : "text-[#F4A6B8] "
            }`}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? "✖️" : "☰"}
        </button>

        {/* Desktop Menu */}
        <ul
          className={`hidden md:flex space-x-8 font-medium ${isHomePage && !isSticky ? "text-white" : "text-[#3B2F2F] "
            }`}
        >
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>

        {/* Right Icons */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            onClick={(e) => handleProtectedNavigation(e, "wishlist")}
            className={`relative text-2xl ${isHomePage && !isSticky ? "text-white" : "text-black  hover:text-[#D97A93]"
              }`}
          >
            <AiOutlineHeart />

            {isLoggedIn && wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#F4A6B8] text-white text-xs rounded-full px-1">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            onClick={(e) => handleProtectedNavigation(e, "cart")}
            className={`relative text-2xl ${isHomePage && !isSticky ? "text-white" : "text-black  hover:text-[#D97A93]"
              }`}
          >
            <HiOutlineShoppingBag />

            {isLoggedIn && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#F4A6B8] text-white text-xs rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User / Login */}
          {isLoggedIn ? (
            <div
              className="relative group"
            >
              {/* Username */}
              <div
                className={`flex items-center gap-2 cursor-pointer ${isHomePage && !isSticky
                  ? "text-white hover:text-[#F4A6B8]"
                  : "text-[#3B2F2F] hover:text-[#D97A93]"
                  }`}
              >
                👤
                <span className="font-semibold hidden lg:inline">
                  Hey, {username}
                </span>
              </div>

              {/* Dropdown */}
              <div
                className="absolute right-0 mt-3 w-48 bg-[#FDECEF] border border-[#F7D6E0] rounded-xl shadow-lg overflow-hidden
                 opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                 transition-all duration-300"
              >
                <Link
                  to="/my-orders"
                  className="block px-5 py-3 text-[#3B2F2F] hover:bg-[#F4A6B8] hover:text-white"
                >
                  My Orders
                </Link>

                <hr className="border-[#F7D6E0]" />

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <button className="bg-[#F4A6B8] text-white px-4 py-2 rounded-full hover:bg-[#D97A93]">
                Login
              </button>
            </Link>
          )}

        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#FDECEF] border-t border-[#F7D6E0]">
          <ul className="flex flex-col space-y-4 px-6 py-4 text-[#3B2F2F] font-medium">
            <li>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link to="/products" onClick={() => setIsMenuOpen(false)}>
                Products
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
            </li>

            {/* Mobile Wishlist + Cart */}
            <div className="flex items-center justify-start space-x-4">
              <Link
                to="/wishlist"
                className="relative text-[#D97A93] text-2xl"
                onClick={(e) => {
                  handleProtectedNavigation(e, "wishlist");
                  setIsMenuOpen(false);
                }}
              >
                <AiOutlineHeart />

                {isLoggedIn && wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#F4A6B8] text-white text-xs rounded-full px-1">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative text-[#D97A93] text-2xl"
                onClick={(e) => {
                  handleProtectedNavigation(e, "cart");
                  setIsMenuOpen(false);
                }}
              >
                <HiOutlineShoppingBag />

                {isLoggedIn && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#F4A6B8] text-white text-xs rounded-full px-1">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Login / Logout */}
            {isLoggedIn ? (
              <>
                <Link
                  to="/my-orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#3B2F2F] hover:text-[#D97A93]"
                >
                  My Orders
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <button className="bg-[#F4A6B8] text-white px-4 py-2 rounded-full hover:bg-[#D97A93] w-full">
                  Login
                </button>
              </Link>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
