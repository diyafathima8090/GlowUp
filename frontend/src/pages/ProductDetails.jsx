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
    <div className="pt-28 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Product Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 p-6 md:p-12">
            
            {/* Left: Product Image */}
            <div className="flex justify-center items-center bg-gray-50/50 rounded-2xl p-8 border border-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-w-[450px] object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-500 ease-in-out"
              />
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="flex items-center text-yellow-400 text-lg">
                  ★★★★<span className="text-gray-300">★</span>
                </span>
                <span className="text-sm font-medium text-gray-500 underline decoration-gray-300 cursor-pointer hover:text-pink-600 transition">
                  250 Reviews
                </span>
              </div>

              <div className="flex items-end gap-3 mb-8 pb-8 border-b border-gray-100">
                <span className="text-4xl font-black text-pink-600">${product.price}</span>
                <span className="text-xl font-medium text-gray-400 line-through mb-1">${Math.round(product.price * 1.2)}</span>
                <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full mb-2 ml-2 tracking-wide uppercase">20% Off</span>
              </div>

              <div className="prose prose-sm sm:prose text-gray-600 mb-8 leading-relaxed">
                <p>
                  {product.description || "This high-quality skincare and beauty product ensures smooth application, long-lasting effect, and premium ingredients for your best look ever!"}
                </p>
              </div>

              {/* Quantity Section */}
              <div className="flex items-center gap-6 mb-10">
                <span className="text-gray-900 font-semibold uppercase tracking-wider text-sm">Quantity</span>
                <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white overflow-hidden w-36 h-12">
                  <button
                    onClick={decreaseQty}
                    className="flex-1 h-full text-gray-500 hover:text-pink-600 hover:bg-pink-50 transition-colors flex items-center justify-center text-lg font-bold bg-gray-50"
                  >
                    −
                  </button>
                  <span className="flex-1 h-full flex items-center justify-center text-gray-900 font-bold border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQty}
                    className="flex-1 h-full text-gray-500 hover:text-pink-600 hover:bg-pink-50 transition-colors flex items-center justify-center text-lg font-bold bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-white text-pink-600 border-2 border-pink-500 hover:bg-pink-50 hover:border-pink-600 font-bold py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-pink-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-pink-700 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Buy Now
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">
            Customer Reviews
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex text-yellow-400 mb-3 text-sm">
                 ★★★★★
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Luxurious Feel</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                "Absolutely love this product! The fragrance lasts all day and
                feels so luxurious. It easily became a staple in my daily routine."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-200 text-pink-700 flex items-center justify-center font-bold text-sm">AK</div>
                <p className="text-sm font-medium text-gray-900">Aisha K.</p>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex text-yellow-400 mb-3 text-sm">
                 ★★★★<span className="text-gray-300">★</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Great Packaging</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
               "Good product, really nice secure packaging. Delivery was extremely fast. Would definitely buy again once this runs out."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm">PS</div>
                <p className="text-sm font-medium text-gray-900">Priya S.</p>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex text-yellow-400 mb-3 text-sm">
                 ★★★★★
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Worth Every Rupee</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                "The best item I’ve ever used! You get what you pay for. The quality here is strictly top-notch compared to generic brands."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center font-bold text-sm">MT</div>
                <p className="text-sm font-medium text-gray-900">Meera T.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
