import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./component/Sidebar";


const AdminDashboard = () => {
  return (
       <div className="flex bg-black text-white min-h-screen">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        <div className="p-6">
          <Outlet />
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
