import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  // 🔹 Load wishlist from localStorage immediately on mount
  useEffect(() => {
    if (user) {
      const savedWishlist = localStorage.getItem(`wishlist_${user.id}`);
      if (savedWishlist) {
        try {
          setWishlist(JSON.parse(savedWishlist));
        } catch (err) {
          console.error("Error parsing saved wishlist:", err);
        }
      }
    } else {
      setWishlist([]);
    }
  }, [user]);

  
  // 🔹 Fetch Wishlist from backend when user logs in
  const fetchWishlist = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get("/wishlist");
      const products = res.data.products || [];
      setWishlist(products);
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(products));
    } catch (err) {
      console.error("Error loading wishlist:", err);
    }
  }, [user]);

  // Auto-fetch wishlist from backend after mounting (if localStorage had stale data)
  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user, fetchWishlist]);

  // 🔹 Toggle wishlist item
  const toggleWishlist = async (product) => {
    if (!user) {
      toast.warning("Please login to use wishlist");
      return;
    }

    const isExisting = wishlist.some(item => (item._id || item.id) === (product._id || product.id));

    try {
      let res;
      if (isExisting) {
        // Remove from wishlist
        res = await api.delete(`/wishlist/${product._id || product.id}`);
      } else {
        // Add to wishlist
        res = await api.post("/wishlist", {
          productId: product._id || product.id
        });
      }

      const updatedWishlist = res.data.products || [];
      setWishlist(updatedWishlist);
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist));

      if (!isExisting) {
        toast.success(`${product.name} added to wishlist!`);
      } else {
        toast.info(`${product.name} removed from wishlist`);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      const errorMessage = error.response?.data?.message || "Failed to update wishlist";
      toast.error(errorMessage);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
