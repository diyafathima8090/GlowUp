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
    <div className="min-h-screen p-6 bg-gradient-to-b from-purple-50 to-purple-100">
      <h2 className="text-4xl font-bold text-purple-600 text-center mb-6">
        Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders yet.</p>
      ) : (
        <div className="max-w-5xl mx-auto space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow p-5 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-purple-600">
                    Order #{order._id}
                  </h3>
                  <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                {order.status !== "Cancelled" && order.status !== "Delivered" && order.status !== "Shipped" && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded shadow transition"
                  >
                    Cancel Order
                  </button>
                )}
              </div>

              <p className="font-semibold mt-2">Total: ${order.totalPrice || order.total}</p>

              <p className="font-semibold mt-1">
                Status:{" "}
                <span
                  className={
                    order.status === "Delivered"
                      ? "text-green-600 font-bold"
                      : order.status === "Shipped"
                        ? "text-blue-600 font-bold"
                        : order.status === "Processing"
                          ? "text-yellow-600 font-bold"
                          : order.status === "Cancelled"
                            ? "text-red-600 font-bold"
                            : "text-purple-600 font-bold"
                  }
                >
                  {order.status || "Pending"}
                </span>
              </p>

              <h4 className="mt-4 font-bold">Items:</h4>

              {order.cart?.map((item) => (
                <div
                  key={item._id || item.id}
                  className="flex items-center justify-between border-b py-2"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p>${item.price}</p>
                      <p>Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
