import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { Package, Truck, CheckCircle2, XCircle, Clock, ShoppingCart, DollarSign, Search, Calendar } from "lucide-react";

const ManageOrders = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(location.state?.search || "");
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load order history");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  const updateStatus = async (userId, orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${userId}/${orderId}`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    }
  };

  const filteredOrders = orders.filter(o =>
    (o.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.user?.email || "").toLowerCase().includes(search.toLowerCase()) ||
    String(o._id || o.id || "").toLowerCase().includes(search.toLowerCase())
  );

  const revenue = orders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  const pendingOrders = orders.filter(o => o.status === "Pending").length;

  return (
    <div className="p-0 md:p-6 w-full max-w-full overflow-hidden animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 tracking-tight mb-2">
            Orders Managment
          </h1>
          <p className="text-gray-400 text-sm font-medium italic">Fulfillment logistics and order transaction stream</p>
        </div>

        {/* QUICK STATS */}
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-none bg-[#1b0a24]/80 border border-pink-500/10 p-4 rounded-3xl flex items-center gap-4 backdrop-blur-md shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Revenue</p>
              <p className="text-xl font-black text-white">₹{revenue.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="flex-1 md:flex-none bg-[#1b0a24]/80 border border-orange-500/10 p-4 rounded-3xl flex items-center gap-4 backdrop-blur-md shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 animate-pulse">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Awaiting</p>
              <p className="text-xl font-black text-white">{pendingOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative group mb-10">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-pink-400 group-focus-within:text-pink-300 transition-colors">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Filter orders by ID or Customer name..."
          className="w-full bg-[#1b0a24]/50 border border-white/5 group-hover:border-pink-500/30 group-focus-within:border-pink-500/50 text-white pl-14 pr-6 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/10 transition-all placeholder-gray-600 shadow-xl backdrop-blur-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 bg-[#1b0a24]/20 rounded-[3rem] border border-dashed border-pink-500/10 backdrop-blur-sm">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-pink-500/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            <Package className="absolute inset-0 m-auto text-pink-500/30 animate-pulse" size={30} />
          </div>
          <p className="text-pink-400/60 mt-8 font-black uppercase tracking-[0.4em] text-[10px]">Syncing Logistics Database...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-32 text-center text-gray-500 flex flex-col items-center gap-8 bg-[#1b0a24]/40 rounded-[3rem] border border-white/5 backdrop-blur-2xl">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-5xl grayscale opacity-30 shadow-inner">
            <ShoppingCart size={40} />
          </div>
          <div>
            <p className="text-xl font-black text-gray-400 tracking-tight italic">Zero Transactions Detected</p>
            <p className="text-[10px] text-gray-600 mt-3 font-mono uppercase tracking-[0.3em]">System status: Awaiting commerce activity</p>
          </div>
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] border border-white/5 bg-[#1b0a24]/40 backdrop-blur-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 text-pink-300">
                  <th className="px-8 py-7 font-black uppercase text-[10px] tracking-[0.25em]">ID</th>
                  <th className="px-8 py-7 font-black uppercase text-[10px] tracking-[0.25em]">Customer Profile</th>
                  <th className="px-8 py-7 font-black uppercase text-[10px] tracking-[0.25em]">Timeline</th>
                  <th className="px-8 py-7 font-black uppercase text-[10px] tracking-[0.25em]">Amount</th>
                  <th className="px-8 py-7 font-black uppercase text-[10px] tracking-[0.25em]">Status</th>
                  <th className="px-8 py-7 font-black uppercase text-[10px] tracking-[0.25em]">Artifacts</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.03]">
                {filteredOrders.map((order, index) => (
                  <tr key={order._id || order.id || index} className="hover:bg-white/[0.02] transition-all duration-500 group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-pink-500/20 group-hover:bg-pink-500 transition-colors rounded-full" />
                        <span className="font-mono text-pink-400 font-black text-sm tracking-tighter">
                          #{String(order._id || order.id || "Unknown").slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-gray-100 group-hover:text-pink-400 transition-colors text-sm uppercase tracking-tight">
                          {order.user?.name || "GUEST CUSTOMER"}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 text-gray-400 group-hover:text-gray-200 transition-colors">
                        <Calendar size={14} className="text-pink-500/40" />
                        <span className="text-xs font-semibold">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          }) : "IMMUTABLE"}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[10px] font-black text-pink-500/50">INR</span>
                        <span className="text-lg font-black text-white group-hover:scale-105 transition-transform origin-left">
                          {(order.totalPrice || order.total || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="relative">
                        <select
                          value={order.status || "Pending"}
                          onChange={(e) => updateStatus(order.user?._id, order._id || order.id, e.target.value)}
                          className={`appearance-none bg-black/40 border border-white/5 group-hover:border-pink-500/20 rounded-2xl px-5 py-2.5 outline-none focus:ring-4 focus:ring-pink-500/10 transition-all cursor-pointer text-[10px] font-black uppercase tracking-[0.2em] pr-12 w-full max-w-[160px] shadow-lg
                            ${order.status === "Delivered" ? "text-green-400" :
                              order.status === "Cancelled" ? "text-red-400" :
                                order.status === "Shipped" ? "text-blue-400" : "text-pink-400"}`}
                        >
                          <option>Pending</option>
                          <option>Processing</option>
                          <option>Shipped</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                          {order.status === "Delivered" ? <CheckCircle2 size={16} /> :
                            order.status === "Cancelled" ? <XCircle size={16} /> :
                              order.status === "Shipped" ? <Truck size={16} /> :
                                <Clock size={16} />}
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex -space-x-3 overflow-hidden group/stack">
                        {(order.cart || order.items || []).map((item, idx) => (
                          <div key={item._id || item.id || idx} className="relative group/item z-0 hover:z-10 transition-all">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-2xl border-4 border-[#1b0a24] shadow-2xl group-hover/item:scale-125 transition-all duration-300 cursor-zoom-in group-hover/stack:rotate-6 group-hover/item:rotate-0"
                            />
                            <div className="absolute -top-1 -right-1 bg-pink-500 text-[9px] font-black text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#1b0a24] opacity-0 group-hover/item:opacity-100 transition-opacity shadow-lg">
                              {item.quantity}
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
        </div>
      )}

      {/* FOOTER METADATA */}
      <div className="mt-12 flex justify-between items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
          <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em]">Node Protocol 3.9 // Order Stream Active</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border border-gray-900 bg-pink-600/10 flex items-center justify-center text-pink-400 text-[8px] font-bold">L{i}</div>)}
          </div>
          <p className="text-[10px] text-gray-500 font-medium italic">Fulfillment latency: 42ms</p>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
