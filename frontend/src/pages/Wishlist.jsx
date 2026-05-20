import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "react-toastify";
import axios from "axios";

const Wishlist = () => {
  const { wishlist, toggleWishlist, fetchWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const user = JSON.parse(localStorage.getItem("currentUser"));

  const handleAddToCart = async (product) => {
    addToCart(product, 1);
    // Remove from wishlist after adding to cart
    toggleWishlist(product);
  };

  const handleRemoveFromWishlist = async (product) => {
    toggleWishlist(product);
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-6 bg-gradient-to-b from-pink-50 to-pink-100">
      <h2 className="text-4xl font-bold text-pink-600 mb-8 text-center">
        Wishlist
      </h2>

      {wishlist.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="mb-4">Your wishlist is empty.</p>
          <Link
            to="/products"
            className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="grid max-w-7xl mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="p-4 bg-white rounded shadow">
              <Link to={`/products/${product.category}/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 object-cover rounded"
                />
                <h3 className="font-semibold mt-3">{product.name}</h3>
                <p className="text-gray-700">${product.price}</p>
              </Link>

              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-pink-500 text-white px-4 py-2 rounded"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => handleRemoveFromWishlist(product)}
                  className="flex-1 border border-red-500 text-red-500 px-4 py-2 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
