import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const admin = JSON.parse(localStorage.getItem("currentAdmin"));
  if (!admin || admin.role !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }
  return <Outlet />;
};

export default ProtectedAdminRoute;
