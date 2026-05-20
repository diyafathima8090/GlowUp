import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./component/Sidebar";


const AdminDashboard = () => {
  return (
    <div className="flex flex-col md:flex-row bg-black text-white min-h-screen w-full relative">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 w-full overflow-hidden">
        <div className="p-4 md:p-10">
          <Outlet />
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
