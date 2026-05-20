import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import StatsCard from "../components/StatsCard";
import SalesChart from "../components/Saleschart";
import OrderStateCircle from "../components/OrderStateCircle";
import {
  Users,
  Package,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  PieChart,
  Activity,
  Calendar
} from "lucide-react";

const DashboardHome = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [orderStateData, setOrderStateData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        const { usersCount, productsCount, ordersCount, totalRevenue, salesData, orderStateData } = res.data;

        setUsersCount(usersCount || 0);
        setProductsCount(productsCount || 0);
        setOrdersCount(ordersCount || 0);
        setTotalRevenue(totalRevenue || 0);
        setSalesData(salesData || []);
        setOrderStateData(orderStateData || []);
      } catch (err) {
        console.error("Failed fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-0 md:p-6 w-full max-w-full overflow-hidden animate-in fade-in duration-700">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 tracking-tight mb-2">
            DashBoard
          </h1>
          <p className="text-gray-400 text-sm font-medium italic">GlowUp overview</p>
        </div>

        <div className="flex items-center gap-3 bg-[#1b0a24]/80 border border-white/5 px-6 py-3 rounded-2xl backdrop-blur-md shadow-xl">
          <Calendar size={16} className="text-pink-400" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest italic pt-0.5">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-2 border-pink-500/10 rounded-full" />
            <div className="absolute inset-0 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-pink-500/50">Synchronizing Data Streams...</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Users"
              value={usersCount}
              icon={Users}
              colorClass="from-blue-500/20 to-indigo-500/20"
            />
            <StatsCard
              title="Total Products"
              value={productsCount}
              icon={Package}
              colorClass="from-pink-500/20 to-rose-500/20"
            />
            <StatsCard
              title="Total Orders"
              value={ordersCount}
              icon={ShoppingBag}
              colorClass="from-amber-500/20 to-orange-500/20"
            />
            <StatsCard
              title="Total Revenue"
              value={`₹${totalRevenue.toLocaleString('en-IN')}`}
              icon={IndianRupee}
              colorClass="from-emerald-500/20 to-teal-500/20"
            />
          </div>

          {/* Visualization Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Sales Chart - Large Component */}
            <div className="lg:col-span-2 bg-[#1b0a24]/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-pink-500/10 transition-colors" />

              <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-pink-500/10 rounded-2xl text-pink-400">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white italic tracking-tight uppercase">Revenue Trajectory</h2>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Categorical performance split</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-white/5 rounded-full border border-white/5">
                  <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest italic">Live Stream</span>
                </div>
              </div>

              <div className="h-[400px]">
                <SalesChart data={salesData} />
              </div>
            </div>

            {/* Order Distribution - Circular Chart */}
            <div className="bg-[#1b0a24]/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden group flex flex-col">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/10 transition-colors" />

              <div className="flex items-center gap-3 mb-10 relative z-10">
                <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400">
                  <PieChart size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white italic tracking-tight uppercase">Order Topology</h2>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Lifecycle status distribution</p>
                </div>
              </div>

              <div className="flex-1 min-h-[350px]">
                <OrderStateCircle data={orderStateData} />
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={12} className="text-pink-500/40" />
                  <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Real-time Telemetry</span>
                </div>
                <span className="text-[8px] font-black text-pink-500 uppercase tracking-widest italic">Stable</span>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-center pt-8 opacity-20 hover:opacity-100 transition-opacity">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="px-6 text-[8px] font-black text-gray-500 uppercase tracking-[0.5em]">End of Transmission</span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
