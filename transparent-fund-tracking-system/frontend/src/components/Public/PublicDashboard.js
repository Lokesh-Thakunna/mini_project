import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { usePublicAuth } from "../../context/PublicAuthContext";

const PublicDashboard = () => {
  const { user, isAuthenticated, logout } = usePublicAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const linkClass =
    "block py-2 px-4 rounded hover:bg-purple-600 hover:text-white transition";
  const activeClass = "bg-purple-600 text-white";

  const handleLogout = () => {
    logout();
    navigate("/public/schemes", { replace: true });
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white shadow flex items-center justify-between px-4 py-3">
        
        {/* Home Button */}
        <button
          onClick={() => navigate("/")}
          className="text-purple-700 font-semibold"
        >
          🏠 Home
        </button>

        <h2 className="text-lg font-bold text-purple-700">
          Public Portal
        </h2>

        {/* Menu Button */}
        <button
          className="text-2xl"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
      </div>

      {/* ================= OVERLAY (MOBILE) ================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-white shadow-md p-4 flex flex-col transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-purple-700">
            Public Portal
          </h2>
          {isAuthenticated && user && (
            <p className="text-sm text-gray-600 mt-1">
              Welcome, {user.fullName || user.email}
            </p>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-1 flex-1">

          {/* Home Link */}
          <NavLink
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="block py-2 px-4 rounded text-gray-700 hover:bg-purple-600 hover:text-white transition"
          >
            🏠 Home
          </NavLink>

          <NavLink
            to="/public/schemes"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
            }
          >
            📊 View Schemes
          </NavLink>

          <NavLink
            to="/public/transactions"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
            }
          >
            💰 Transaction History
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/public/grievance"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
                }
              >
                📝 Submit Grievance
              </NavLink>

              <NavLink
                to="/public/my-grievances"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
                }
              >
                📋 My Grievances
              </NavLink>
            </>
          ) : (
            <NavLink
              to="/public/signin"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
              }
            >
              🔐 Sign In
            </NavLink>
          )}

          <NavLink
            to="/public/reports"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
            }
          >
            📥 Download Reports
          </NavLink>
        </nav>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
            >
              🚪 Logout
            </button>
          ) : (
            <div className="space-y-2">
              <NavLink
                to="/public/signup"
                onClick={() => setSidebarOpen(false)}
                className="block w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition text-center"
              >
                Sign Up
              </NavLink>
              <p className="text-xs text-gray-500 text-center">
                Sign up to submit grievances and track status
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-4 sm:p-6 mt-14 md:mt-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicDashboard;
