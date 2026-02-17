import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  // ---------------------------
  // SAVE CUSTOMER INFO
  // ---------------------------
  const [customerInfo, setCustomerInfo] = useState(() => {
    const saved = localStorage.getItem("customerInfo");
    return saved
      ? JSON.parse(saved)
      : {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
      };
  });

  // ---------------------------
  // SAVE STEP
  // ---------------------------
  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem("checkoutStep");
    return savedStep ? Number(savedStep) : 1;
  });

  // ---------------------------
  // HANDLE INPUT CHANGE
  // ---------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    // ZIP must be only numbers
    if (name === "zip") {
      if (/^\d*$/.test(value)) {
        const updated = { ...customerInfo, [name]: value };
        setCustomerInfo(updated);
        localStorage.setItem("customerInfo", JSON.stringify(updated));
      }
      return;
    }

    const updated = { ...customerInfo, [name]: value };
    setCustomerInfo(updated);
    localStorage.setItem("customerInfo", JSON.stringify(updated));
  };

  // ---------------------------
  // SAVE STEP TO LOCALSTORAGE
  // ---------------------------
  useEffect(() => {
    localStorage.setItem("checkoutStep", step);
  }, [step]);

  // ---------------------------
  // FIXED PRICE HANDLING (MAIN FIX)
  // ---------------------------
  const toNumber = (value) =>
    Number(String(value).replace(/[^0-9.]/g, ""));

  const grandTotal = cart.reduce((sum, item) => {
    return sum + toNumber(item.price) * (item.quantity || 1);
  }, 0);

  // ---------------------------
  // PROCEED BUTTON
  // ---------------------------
  const handleProceed = (e) => {
    e.preventDefault();
    if (!customerInfo.fullName || !customerInfo.address || !customerInfo.email) {
      toast.warning('Please fill in all required fields.');
      return;
    }
    setStep(2);
  };

  // ---------------------------
  // PLACE ORDER
  // ---------------------------
  const handlePlaceOrder = async () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      toast.error("You must be logged in to place an order.");
      return;
    }

    const newOrder = {
      id: Date.now(),
      customerInfo,
      cart,
      total: grandTotal,
      paymentMethod,  // store selected payment method
      date: new Date().toLocaleString(),
    };

    try {
      // Place order using modular endpoint
      await api.post("/orders", {
        cart: cart,
        totalPrice: grandTotal,
        shippingAddress: customerInfo, // includes address, city, zip, etc.
        paymentMethod: paymentMethod
      });

      // Clear cart immediately after successful order
      await clearCart(false);

      localStorage.removeItem("customerInfo");
      localStorage.removeItem("checkoutStep");

      toast.success("Order placed successfully! 🎉", {
        position: "top-center",
        autoClose: 1500,
      });

      setTimeout(() => {
        navigate("/my-orders");
      }, 1800);

    } catch (error) {
      console.error("Order placement failed:", error);
      toast.error(error.response?.data?.message || "Failed to place order. Server error.");
    }
  };
  const [paymentMethod, setPaymentMethod] = useState("cod"); // default COD

  // ---------------------------
  // STEP 1 FORM
  // ---------------------------
  const renderCustomerInfoForm = () => (
    <form onSubmit={handleProceed} className="space-y-6">
      <h3 className="text-2xl font-semibold text-pink-700 mb-4 text-center md:text-left">
        1. Shipping Information
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={customerInfo.fullName}
          onChange={handleChange}
          required
          className="mt-1 w-full border border-gray-300 rounded-md p-3"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            value={customerInfo.email}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded-md p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={customerInfo.phone}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-md p-3"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Street Address</label>
        <input
          type="text"
          name="address"
          value={customerInfo.address}
          onChange={handleChange}
          required
          className="mt-1 w-full border border-gray-300 rounded-md p-3"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            name="city"
            value={customerInfo.city}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded-md p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Zip / Postal Code</label>
          <input
            type="text"
            name="zip"
            inputMode="numeric"
            value={customerInfo.zip}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
            }}
            required
            className="mt-1 w-full border border-gray-300 rounded-md p-3"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-pink-500 text-white font-bold py-3 rounded-md"
      >
        Proceed to Payment
      </button>
    </form>
  );

  // ---------------------------
  // STEP 2 REVIEW + PAYMENT
  // ---------------------------
  const renderPaymentReview = () => (
    <div className="space-y-8">
      <div className="p-6 border rounded-lg bg-pink-50">
        <h3 className="text-2xl font-semibold text-pink-700 flex justify-between">
          2. Order Review
          <button onClick={() => setStep(1)} className="text-pink-500 underline">
            Edit
          </button>
        </h3>

        <p><strong>Name:</strong> {customerInfo.fullName}</p>
        <p><strong>Address:</strong> {customerInfo.address}, {customerInfo.city} - {customerInfo.zip}</p>
        <p><strong>Phone:</strong> {customerInfo.phone || "N/A"}</p>
        <p><strong>Email:</strong> {customerInfo.email}</p>
      </div>

      <div className="p-6 border rounded-lg bg-white space-y-4">
        <h4 className="text-xl font-semibold text-gray-800">Payment Method</h4>

        <label className="flex items-center space-x-3">
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="h-5 w-5"
          />
          <span>Cash on Delivery (COD)</span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="h-5 w-5"
          />
          <span>Card Payment</span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="radio"
            name="paymentMethod"
            value="upi"
            checked={paymentMethod === "upi"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="h-5 w-5"
          />
          <span>UPI Payment</span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="radio"
            name="paymentMethod"
            value="gpay"
            checked={paymentMethod === "gpay"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="h-5 w-5"
          />
          <span>Google Pay</span>
        </label>
      </div>


      <div className="p-6 border-2 border-pink-200 rounded-lg bg-pink-50">
        <h4 className="text-2xl font-bold flex justify-between">
          <span>Total:</span>
          <span className="text-pink-600">${grandTotal.toLocaleString('en-IN')}</span>
        </h4>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-green-500 text-white font-bold py-3 rounded-md"
      >
        Place Order
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 bg-gray-50">
      <h1 className="text-4xl font-extrabold text-center mb-8">Final Checkout</h1>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        {step === 1 ? renderCustomerInfoForm() : renderPaymentReview()}
      </div>
    </div>
  );
};

export default CheckoutPage;
