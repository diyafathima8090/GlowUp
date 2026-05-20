import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";


const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  // 🔹 Load cart from localStorage immediately on mount
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart){
        try {
          setCart(JSON.parse(savedCart));
        } catch (err) {
          console.error("Error parsing saved cart:", err);
        }
      }
    } else {
      setCart([]);
    }
  }, [user]);

  // 🔹 Fetch Cart from backend when user logs in
  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get("/cart");
      const dbCart = res.data || [];
      setCart(dbCart);
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(dbCart));
    } catch (err) {
      console.error("Error loading cart:", err);
    }
  }, [user]);

  // Auto-fetch cart from backend after mounting (if localStorage had stale data)
  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  // 🔹 Add / Update cart item
  const addToCart = async (product, quantity = 1, showToast = true) => {
    if (!user) {
      toast.warning("Please login to add items to cart");
      return;
    }

    try {
      const res = await api.post("/cart/add", {
        productId: product._id || product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      });

      const updatedCart = res.data;
      setCart(updatedCart);
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCart));
      if (showToast) {
        toast.success(`🛒 ${product.name} added to cart!`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  // 🔹 Remove item
  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/remove/${productId}`);
      const updatedCart = res.data;
      setCart(updatedCart);
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCart));
      toast.info("Item removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  // 🔹 Clear cart
  const clearCart = async (showToast = true) => {
    try {
      await api.delete("/cart/clear");
      setCart([]);
      localStorage.removeItem(`cart_${user?.id}`);
      if (showToast) {
        toast.success("Cart cleared successfully");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
