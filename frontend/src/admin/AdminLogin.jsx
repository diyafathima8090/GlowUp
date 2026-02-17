import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Enter email and password.");

    try {
      const res = await api.post("/auth/login", { email, password });
      const { user, token } = res.data;

      if (user.role !== "admin") {
        return toast.error("Not an admin account.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("currentAdmin", JSON.stringify(user));
      toast.success("Welcome Admin!");
      setTimeout(() => navigate("/admin"), 800);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed. Server error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <ToastContainer />
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          <button className="w-full bg-pink-600 text-white py-2 rounded">Sign in</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
