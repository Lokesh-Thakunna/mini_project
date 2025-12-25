import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useUtilizationAuth } from "../../context/UtilizationAuthContext";

const UtilizationDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useUtilizationAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const linkClass =
    "block py-2 px-4 rounded transition hover:bg-green-600 hover:text-white";
  const activeClass = "bg-green-600 text-white";

  const handleLogout = () => {
    logout();
    navigate("/utilization/signin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ===== MOBILE TOP BAR ===== */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow z-40 flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-2xl font-bold text-green-700"
        >
          ☰
        </button>
        <h2 className="text-lg font-semibold text-green-700">
          Fund Utilization
        </h2>
        <button
          onClick={() => navigate("/")}
          className="text-sm bg-gray-600 text-white px-3 py-1 rounded"
        >
          Home
        </button>
      </div>

      {/* ===== OVERLAY (Mobile) ===== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full w-64 bg-white shadow-md z-50
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-green-700">
            Fund Utilization
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-xl"
          >
            ✕
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="m-4 p-3 bg-green-50 rounded border border-green-200">
            <p className="text-sm font-semibold">{user.fullName}</p>
            <p className="text-xs text-gray-600">{user.organization}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 px-4">
          <NavLink
            to="/utilization/requests"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
            }
          >
            📋 My Requests
          </NavLink>

          <NavLink
            to="/utilization/new"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
            }
          >
            ➕ Submit Request
          </NavLink>
        </nav>

        {/* Bottom Buttons */}
        <div className="p-4 border-t space-y-2">
          <button
            onClick={() => {
              navigate("/");
              setSidebarOpen(false);
            }}
            className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
          >
            🏠 Home
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 pt-16 md:pt-0 p-4 md:p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default UtilizationDashboard;
