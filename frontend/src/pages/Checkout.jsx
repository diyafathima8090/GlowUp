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
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900">1. Shipping Information</h3>
        <p className="text-sm text-gray-500 mt-1">Where should we send your glow-up goodies?</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={customerInfo.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all bg-gray-50 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={customerInfo.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={customerInfo.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Street Address</label>
          <input
            type="text"
            name="address"
            value={customerInfo.address}
            onChange={handleChange}
            placeholder="123 Beauty Lane, Apt 4B"
            required
            className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all bg-gray-50 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={customerInfo.city}
              onChange={handleChange}
              placeholder="New York"
              required
              className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Zip / Postal Code</label>
            <input
              type="text"
              name="zip"
              inputMode="numeric"
              value={customerInfo.zip}
              onChange={handleChange}
              placeholder="10001"
              onKeyDown={(e) => {
                if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
              }}
              required
              className="w-full border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all bg-gray-50 focus:bg-white"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 mt-8">
        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all text-lg"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );

  // ---------------------------
  // STEP 2 REVIEW + PAYMENT
  // ---------------------------
  const renderPaymentReview = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Review Information */}
      <div className="group relative p-6 border border-gray-200 rounded-2xl bg-gray-50 hover:border-pink-200 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Shipping Details</h3>
          <button 
            onClick={() => setStep(1)} 
            className="text-sm font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            Edit
          </button>
        </div>
        
        <div className="space-y-2 text-sm text-gray-700">
          <p className="flex"><span className="w-20 font-semibold text-gray-500">Name:</span> <span>{customerInfo.fullName}</span></p>
          <p className="flex"><span className="w-20 font-semibold text-gray-500">Address:</span> <span>{customerInfo.address}, {customerInfo.city} {customerInfo.zip}</span></p>
          <p className="flex"><span className="w-20 font-semibold text-gray-500">Email:</span> <span>{customerInfo.email}</span></p>
          <p className="flex"><span className="w-20 font-semibold text-gray-500">Phone:</span> <span>{customerInfo.phone || "N/A"}</span></p>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h3>
        <p className="text-sm text-gray-500 mb-6">All transactions are secure and encrypted.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: "cod", label: "Cash on Delivery", icon: "💵" },
            { id: "card", label: "Credit / Debit Card", icon: "💳" },
            { id: "upi", label: "UPI", icon: "📱" },
            { id: "gpay", label: "Google Pay", icon: "✨" }
          ].map((method) => (
            <label 
              key={method.id} 
              className={`relative flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === method.id ? "border-pink-500 bg-pink-50/50" : "border-gray-200 bg-white hover:border-pink-200"}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <span className="text-2xl mr-4">{method.icon}</span>
              <span className={`font-semibold ${paymentMethod === method.id ? "text-pink-900" : "text-gray-700"}`}>
                {method.label}
              </span>
              
              {/* Checkmark indicator */}
              {paymentMethod === method.id && (
                <div className="absolute right-4 text-pink-600">
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                </div>
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 mt-8">
        <button
          onClick={handlePlaceOrder}
          className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all text-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Complete Order · ${grandTotal.toLocaleString('en-IN')}
        </button>
      </div>
    </div>
  );

  // ---------------------------
  // ORDER SUMMARY SIDEBAR
  // ---------------------------
  const renderOrderSummary = () => (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full sticky top-28">
      <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Order Summary</h3>
      
      <div className="flex-1 overflow-y-auto max-h-[50vh] pr-2 space-y-5 mb-6 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="text-center py-10 opacity-60">
            <span className="text-4xl block mb-2">🛒</span>
            <p className="text-gray-500 italic">Your cart is empty.</p>
          </div>
        ) : (
          cart.map((item, idx) => (
            <div key={idx} className="flex gap-4 items-center group">
              <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 truncate">{item.name}</h4>
                <p className="text-xs text-gray-500 mt-1">Qty: <span className="font-medium text-gray-700">{item.quantity || 1}</span></p>
              </div>
              <div className="text-sm font-bold text-gray-900">
                ${(toNumber(item.price) * (item.quantity || 1)).toLocaleString('en-IN')}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-4 border-t border-dashed border-gray-200 space-y-3">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Subtotal</span>
          <span className="font-medium text-gray-800">${grandTotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Shipping Estimate</span>
          <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs">FREE</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Taxes</span>
          <span className="font-medium text-gray-800">Calculated later</span>
        </div>
        
        <div className="flex justify-between items-center text-xl font-bold text-gray-900 pt-4 mt-2 border-t border-gray-100">
          <span>Total</span>
          <span className="text-pink-600">${grandTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-28 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Checkout</h1>
          <p className="text-sm md:text-base text-gray-500 mt-2">Almost there! Choose your payment method to complete the order.</p>
        </div>

        {/* Main Grid: Left Flow | Right Summary */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Form Flow */}
          <div className="w-full lg:w-2/3 order-2 lg:order-1">
             {/* Progress Tabs (Visual only) */}
             <div className="flex items-center gap-2 mb-6 ml-2">
                <span className={`text-sm font-bold ${step === 1 ? 'text-pink-600' : 'text-gray-400'}`}>1. Shipping</span>
                <span className="text-gray-300">›</span>
                <span className={`text-sm font-bold ${step === 2 ? 'text-pink-600' : 'text-gray-400'}`}>2. Payment & Review</span>
             </div>

             <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
               {step === 1 ? renderCustomerInfoForm() : renderPaymentReview()}
             </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-1/3 order-1 lg:order-2">
             {renderOrderSummary()}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
