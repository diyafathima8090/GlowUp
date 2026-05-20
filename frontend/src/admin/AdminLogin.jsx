import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Enter email and password.");

    setLoading(true);
    try {
      const res = await api.post("/users/login", { email, password });
      const { user, token } = res.data;

      if (user.role !== "admin") {
        return toast.error("Access denied. Not an admin account.");
      }

      localStorage.setItem("adminToken", token);
      localStorage.setItem("currentAdmin", JSON.stringify(user));
      toast.success("Welcome Admin! 🎉");
      setTimeout(() => navigate("/admin"), 800);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0a0010 0%, #1a0030 50%, #0a0010 100%)",
      padding: "1rem"
    }}>
      <ToastContainer />
      <div style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(236, 72, 153, 0.3)",
        borderRadius: "1.5rem",
        padding: "2.5rem",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 25px 50px rgba(236, 72, 153, 0.2)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{
            fontSize: "2rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, #f472b6, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "0.5rem"
          }}>GlowUp Admin</h1>
          <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>Sign in to your admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", color: "#d1d5db", fontSize: "0.875rem", marginBottom: "0.5rem", fontWeight: "500" }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@glowup.com"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(236, 72, 153, 0.3)",
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
                color: "white",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#d1d5db", fontSize: "0.875rem", marginBottom: "0.5rem", fontWeight: "500" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(236, 72, 153, 0.3)",
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
                color: "white",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading
                ? "rgba(236, 72, 153, 0.4)"
                : "linear-gradient(135deg, #ec4899, #be185d)",
              color: "white",
              border: "none",
              borderRadius: "0.75rem",
              padding: "0.875rem",
              fontSize: "1rem",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              marginTop: "0.5rem"
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
