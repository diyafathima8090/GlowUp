import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, clearCart, addToCart, fetchCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // 💰 Calculate total price
  const totalPrice = cart.reduce((sum, item) => {
    const numericPrice =
      typeof item.price === "number"
        ? item.price
        : parseFloat(item.price?.replace(/[$₹,]/g, "")) || 0;

    return sum + numericPrice * (item.quantity || 1);
  }, 0);

  // 🚀 Go to Checkout Page
  const goToCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 pt-28 pb-12 px-6">
      <h2 className="text-4xl font-bold text-pink-600 text-center mb-6">
        🛒 Your Cart
      </h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty</p>
      ) : (
        <div className="max-w-5xl mx-auto space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-white shadow-md p-4 rounded-lg"
            >
              {/* Left */}
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />

                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price}</p>

                  {/* Quantity Controller */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() =>
                        item.quantity > 1 &&
                        addToCart(item, -1)
                      }
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      −
                    </button>

                    <span className="font-semibold">
                      {item.quantity || 1}
                    </span>

                    <button
                      onClick={() => addToCart(item, 1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          ))}
          {/* Total */}
          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mt-6">
            <p className="text-xl font-bold">
              Total: ${totalPrice.toFixed(2)}
            </p>

            <button
              onClick={goToCheckout}
              className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;


