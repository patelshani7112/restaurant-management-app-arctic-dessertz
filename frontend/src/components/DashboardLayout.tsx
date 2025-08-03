import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - now toggleable on all screen sizes */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex-shrink-0 w-64 bg-gray-800 transition-transform duration-200 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content Area - margin now depends on sidebar state */}
      <div
        className={`flex-grow flex flex-col transition-all duration-200 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Header - always visible */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
