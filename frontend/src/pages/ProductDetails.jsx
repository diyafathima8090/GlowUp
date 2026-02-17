import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = () => {
  const { id, category } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1)



  const increaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // 🔹 Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);;
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("❌ Failed to load product details!");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, category]);

  if (loading)
    return (
      <p className="text-center mt-10 text-lg text-gray-700">
        Loading product details...
      </p>
    );

  if (!product)
    return (
      <p className="text-center text-red-500 mt-10">Product not found! ❌</p>
    );

  // 🔹 Add to Cart handler
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, false);
    toast.info("Redirecting to checkout...");
    setTimeout(() => navigate("/checkout"), 1200);
  };


  return (
    <div className="bg-pink-50 min-h-screen flex flex-col items-center">
      {/* 🔹 Product Info Section */}
      <div className="p-8 flex flex-col lg:flex-row gap-12 justify-center items-start w-full max-w-6xl">
        {/* Left: Product Image */}
        <div className="flex flex-col items-center lg:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-[550px] h-[550px] object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Right: Product Info */}
        <div className="lg:w-3/4 bg-white p-8 rounded-2xl shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {product.name}
          </h1>
          <p className="text-green-600 font-medium mb-1">⭐ 4.2 (250 Ratings)</p>

          <p className="text-2xl font-semibold text-pink-600 mb-4">
            ${product.price}{" "}
            <span className="text-gray-400 text-lg line-through ml-2">
              ${Math.round(product.price * 1.2)}
            </span>{" "}
            <span className="text-green-500 text-sm">20% OFF</span>
          </p>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description ||
              "This high-quality skincare and beauty product ensures smooth application, long-lasting effect, and premium ingredients for your best look ever!"}
          </p>

          {/* Quantity Section */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-gray-700 font-medium">Quantity:</span>

            <div className="flex items-center border rounded-full overflow-hidden">
              <button
                onClick={decreaseQty}
                className="px-4 py-2 text-lg bg-gray-100 hover:bg-gray-200"
              >
                −
              </button>

              <span className="px-6 py-2 text-lg font-semibold">
                {quantity}
              </span>

              <button
                onClick={increaseQty}
                className="px-4 py-2 text-lg bg-gray-100 hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>


          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full shadow-md transition"
            >
              🛒 Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-full shadow-md transition"
            >
              💳 Buy Now
            </button>
          </div>
          <div className="w-full max-w-6xl mt-12 bg-white rounded-2xl shadow-md p-8 mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              📝 Customer Reviews
            </h2>

            <div className="space-y-6">
              {/* Review 1 */}
              <div className="border-b border-gray-200 pb-4">
                <p className="text-yellow-500 text-lg">⭐️⭐️⭐️⭐️⭐️</p>
                <p className="text-gray-700 mt-1">
                  “Absolutely love this product! The fragrance lasts all day and
                  feels so luxurious.”
                </p>
                <p className="text-sm text-gray-500 mt-1">– Aisha K.</p>
              </div>

              {/* Review 2 */}
              <div className="border-b border-gray-200 pb-4">
                <p className="text-yellow-500 text-lg">⭐️⭐️⭐️⭐️☆</p>
                <p className="text-gray-700 mt-1">
                  “Good product, nice packaging. Would definitely buy again.”
                </p>
                <p className="text-sm text-gray-500 mt-1">– Priya S.</p>
              </div>

              {/* Review 3 */}
              <div>
                <p className="text-yellow-500 text-lg">⭐️⭐️⭐️⭐️⭐️</p>
                <p className="text-gray-700 mt-1">
                  “The best perfume I’ve ever used! Worth every rupee.”
                </p>
                <p className="text-sm text-gray-500 mt-1">– Meera T.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
