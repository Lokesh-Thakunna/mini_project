import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const PublicDashboard = () => {
  const linkClass =
    "block py-2 px-4 rounded hover:bg-purple-600 hover:text-white transition";
  const activeClass = "bg-purple-600 text-white";

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-2 text-purple-700">Public Portal</h2>
        {/* <p className="text-sm text-gray-600 mb-6">
          Transparency & Accountability
        </p> */}
        <nav className="space-y-1 flex-1">
          <NavLink
            to="/public/schemes"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
            }
          >
            📊 View Schemes
          </NavLink>
          <NavLink
            to="/public/transactions"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
            }
          >
            💰 Transaction History
          </NavLink>
          <NavLink
            to="/public/grievance"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
            }
          >
            📝 Submit Grievance
          </NavLink>
          <NavLink
            to="/public/reports"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
            }
          >
            📥 Download Reports
          </NavLink>
        </nav>
        
        {/* Info */}
        <div className="mt-auto pt-4 border-t">
          <p className="text-xs text-gray-500 text-center">
            Citizen Transparency Portal
          </p>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicDashboard;

