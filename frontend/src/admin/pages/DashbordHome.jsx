import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import StatsCard from "../components/StatsCard";
import SalesChart from "../components/SalesChart";
import OrderStateCircle from "../components/OrderStateCircle";

const DashboardHome = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [orderStateData, setOrderStateData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, productsResponse] = await Promise.all([
          api.get("/users"),
          api.get("/products"),
        ]);

        const users = usersResponse.data;
        const products = productsResponse.data;

        setUsersCount(users.length || 0);
        setProductsCount(products.length || 0);

        let totalOrders = 0;
        const orderStatusMap = {
          Delivered: 0,
          Pending: 0,
          Shipped: 0,
          Processing: 0,
          Cancelled: 0,
        };
        const salesByProduct = {};

        users.forEach(user => {
          if (user.orders) {
            totalOrders += user.orders.length;
            user.orders.forEach(order => {
              const status = order.status || 'Delivered';
              orderStatusMap[status] = (orderStatusMap[status] || 0) + 1;

              if (status !== 'Cancelled') {
                order.cart.forEach(item => {
                  const revenue = item.price * item.quantity;
                  salesByProduct[item._id] = (salesByProduct[item._id] || 0) + revenue;
                });
              }
            });
          }
        });

        setOrdersCount(totalOrders);

        setOrderStateData(
          Object.keys(orderStatusMap)
            .filter(key => orderStatusMap[key] > 0)
            .map(key => ({ name: key, value: orderStatusMap[key] }))
        );

        const categoryMap = {};
        products.forEach(product => {
          const revenue = salesByProduct[product._id] || 0;
          if (revenue > 0) {
            categoryMap[product.category] = (categoryMap[product.category] || 0) + revenue;
          }
        });

        setSalesData(
          Object.keys(categoryMap).map(category => ({
            category: category.charAt(0).toUpperCase() + category.slice(1),
            revenue: categoryMap[category],
          }))
        );
      } catch (err) {
        console.error("Failed fetching dashboard data", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-10 px-6 sm:px-8 lg:px-16 py-8 w-full 
      text-white ">

      {/* Title */}
      <h1 className="text-4xl sm:text-3xl md:text-4xl font-extrabold text-pink-400 drop-shadow-lg">
        Dashboard Overview
      </h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatsCard title="Users" value={usersCount} className="min-h-[140px] sm:min-h-[150px]" />
        <StatsCard title="Products" value={productsCount} className="min-h-[140px] sm:min-h-[150px]" />
        <StatsCard title="Orders" value={ordersCount} className="min-h-[140px] sm:min-h-[150px]" />
      </div>

      <hr className="border-pink-700/40" />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Sales Chart */}
        <div className="bg-[#1b0a24] border border-pink-800/40 
          p-6 sm:p-8 rounded-2xl shadow-xl shadow-pink-900/30 flex flex-col">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-pink-300">
            Sales Overview (By Category)
          </h2>
          <div className="w-full flex-1 h-[300px] sm:h-[350px] lg:h-[400px]">
            <SalesChart data={salesData} />
          </div>
        </div>

        {/* Order State Chart */}
        <div className="bg-[#1b0a24] border border-pink-800/40 
          p-6 sm:p-8 rounded-2xl shadow-xl shadow-pink-900/30 flex flex-col items-center">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-pink-300">
            Order State Overview
          </h2>
          <div className="w-full flex-1 h-[300px] sm:h-[350px] lg:h-[400px] max-w-full">
            <OrderStateCircle data={orderStateData} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;
