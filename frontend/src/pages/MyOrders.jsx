import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Swal from "sweetalert2";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/myorders");
        setOrders(res.data || []);
      } catch (error) {
        console.log("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [user?._id]);

  // Handle Cancel Order
  const handleCancelOrder = async (orderId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/orders/${orderId}`);

        Swal.fire(
          'Cancelled!',
          'Your order has been cancelled.',
          'success'
        );

        // Update UI locally
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "Cancelled" } : order
          )
        );
      } catch (error) {
        console.error("Error cancelling order:", error);
        toast.error(error.response?.data?.message || "Failed to cancel order");
      }
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          My Orders
        </h2>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center">
             <span className="text-5xl mb-4">📦</span>
             <p className="text-xl font-medium text-gray-700">You haven't placed any orders yet.</p>
             <p className="text-gray-500 mt-2">Time to treat yourself to some GlowUp products!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, index) => {
              // Creating a clean sequential Order ID based on the array length
              const orderNumber = String(orders.length - index).padStart(3, '0');
              const rawStat = order.status || "Pending";
              
              // Status Badge Styling Logic
              let statusClasses = "bg-gray-100 text-gray-700";
              if (rawStat === "Delivered") statusClasses = "bg-green-100 text-green-700";
              else if (rawStat === "Shipped") statusClasses = "bg-blue-100 text-blue-700";
              else if (rawStat === "Processing") statusClasses = "bg-yellow-100 text-yellow-700";
              else if (rawStat === "Cancelled") statusClasses = "bg-red-100 text-red-700";
              else if (rawStat === "Pending") statusClasses = "bg-orange-100 text-orange-700";

              return (
                <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Order Header / Meta */}
                  <div className="bg-gray-50 px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-x-12 gap-y-4 text-sm">
                      <div>
                        <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">Order Placed</p>
                        <p className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">Total</p>
                        <p className="font-semibold text-gray-900">${(order.totalPrice || order.total).toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">Order No.</p>
                        <p className="font-semibold text-gray-900">#GLOW-{orderNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:items-end md:items-center gap-3">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-white/50 ${statusClasses}`}>
                        {rawStat}
                      </span>
                      
                      {/* Cancel Order Action */}
                      {rawStat !== "Cancelled" && rawStat !== "Delivered" && rawStat !== "Shipped" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="text-sm font-semibold text-red-500 hover:text-white border border-red-500 hover:bg-red-500 px-4 py-1.5 rounded-lg transition-all shadow-sm"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Body / Items List */}
                  <div className="p-6">
                    <h4 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                       <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                       Order Items
                    </h4>
                    
                    <div className="space-y-4">
                      {(order.items || order.cart)?.map((item, idx) => (
                        <div
                          key={item._id || item.id || idx}
                          className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 group hover:bg-pink-50/30 transition-colors"
                        >
                          {/* Item Image */}
                          <div className="w-20 h-20 flex-shrink-0 bg-white rounded-lg p-1 border border-gray-200 overflow-hidden shadow-sm">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          
                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 truncate text-lg pr-4">{item.name}</p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                              <span className="bg-white px-2.5 py-1 rounded-md border border-gray-200 font-medium text-gray-700 shadow-sm flex items-center gap-1">
                                Qty: <span className="font-bold">{item.quantity}</span>
                              </span>
                              <span className="font-medium text-gray-500">${item.price} each</span>
                            </div>
                          </div>
                          
                          {/* Item Price */}
                          <div className="text-right pl-4">
                             <p className="font-black text-pink-600 text-xl">${(item.price * item.quantity).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
