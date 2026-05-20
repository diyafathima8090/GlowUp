import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const token = localStorage.getItem("adminToken");
  const admin = JSON.parse(localStorage.getItem("currentAdmin") || "null");

  if (!token || !admin || admin.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedAdminRoute;
