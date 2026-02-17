import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get("/users");
      const all = (res.data || []).flatMap((u) =>
        (u.orders || []).map((o) => ({
          ...o,
          userId: u._id,
          userName: u.name,
        }))
      );
      setOrders(all);
    };
    fetch();
  }, []);

  const updateStatus = async (userId, orderId, newStatus) => {
    try {
      const uRes = await api.get(`/users/${userId}`);
      const updatedOrders = (uRes.data.orders || []).map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      );

      await api.patch(`/users/${userId}`, {
        orders: updatedOrders,
      });
      const lsOrders = JSON.parse(localStorage.getItem("orders")) || [];
      const updatedLS = lsOrders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      );
      localStorage.setItem("orders", JSON.stringify(updatedLS));

      // Refresh orders
      const res = await api.get("/users");
      const all = (res.data || []).flatMap((u) =>
        (u.orders || []).map((o) => ({
          ...o,
          userId: u._id,
          userName: u.name,
        }))
      );
      setOrders(all);
    } catch (err) {
      alert("Failed to update order status.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-[800px] w-full border-collapse">
            <thead className="bg-pink-700 sticky top-0 z-10">
              <tr className="text-left">
                <th className="p-3 border">Order ID</th>
                <th className="p-3 border">User</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Total</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Items</th>
                {/* <th className="p-3 border">Action</th> */}
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border">
                  <td className="p-3 border font-medium">#{order.id}</td>
                  <td className="p-3 border">{order.userName}</td>
                  <td className="p-3 border">{order.date}</td>
                  <td className="p-3 border font-semibold text-green-700">
                    ₹{order.total}
                  </td>

                  <td className="p-3 border">
                    <select
                      defaultValue={order.status}
                      onChange={(e) =>
                        updateStatus(order.userId, order.id, e.target.value)
                      }
                      className="border bg-black rounded px-2 py-1 w-full"
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>

                  {/* ===== Items with Photos ===== */}
                  <td className="p-3 border">
                    <div className="space-y-3">
                      {(order.cart || order.items || []).map((item) => (
                        <div key={item._id || item.id} className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
