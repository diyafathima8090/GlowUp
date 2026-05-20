import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, LayoutDashboard, Package, ShoppingCart, Users } from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);  
  const [mounted, setMounted] = useState(false); 

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="md:hidden flex justify-between items-center p-4 shadow">
        <h2 className="text-xl font-bold text-pink-400">GlowUp Admin</h2>
        <button
          onClick={() => setOpen(!open)}
          className="text-pink-400 focus:outline-none"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div
        className={`
          fixed md:static top-0 left-0 min-h-screen w-64 shadow-xl p-6 z-50
          overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800
           text-gray-300
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
      >
        <h2 className="text-2xl font-bold text-pink-400 mb-10 hidden md:block">
          GlowUp
        </h2>

        <nav className="space-y-3">
          <NavLink
            to="/admin"
            end
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg font-medium transition-all
              ${isActive
                ? "bg-pink-600/20 text-pink-300 border border-pink-600/40"
                : "hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg font-medium transition-all
              ${isActive
                ? "bg-pink-600/20 text-pink-300 border border-pink-600/40"
                : "hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <Package size={20} />
            Products
          </NavLink>

          <NavLink
            to="/admin/orders"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg font-medium transition-all
              ${isActive
                ? "bg-pink-600/20 text-pink-300 border border-pink-600/40"
                : "hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <ShoppingCart size={20} />
            Orders
          </NavLink>

          <NavLink
            to="/admin/users"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg font-medium transition-all
              ${isActive
                ? "bg-pink-600/20 text-pink-300 border border-pink-600/40"
                : "hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <Users size={20} />
            Users
          </NavLink>

          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              localStorage.removeItem("currentAdmin");
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 p-3 rounded-lg font-medium transition-all w-full text-left
              hover:bg-red-700/20 hover:text-red-400 border border-transparent hover:border-red-600/40 mt-10"
          >
            <X size={20} />
            Logout
          </button>
        </nav>
      </div>

      {/* MOBILE BACKDROP */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden
        transition-opacity duration-500 ease-in-out
        ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      ></div>
    </>
  );
};

export default Sidebar;
