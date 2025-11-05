import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const linkClass =
    "block py-2 px-4 rounded hover:bg-blue-600 hover:text-white transition";
  const activeClass = "bg-blue-600 text-white";

  const handleLogout = () => {
    logout();
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Admin Portal</h2>
        <nav className="space-y-1 flex-1">
          <NavLink
            to="/admin/dashboard/add-scheme"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
            }
          >
            Add Scheme
          </NavLink>
          <NavLink
            to="/admin/dashboard/use-fund"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
            }
          >
            Use Fund
          </NavLink>
          <NavLink
            to="/admin/dashboard/view-schemes"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
            }
          >
            View Schemes
          </NavLink>
          <NavLink
            to="/admin/dashboard/transactions"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
            }
          >
            Transaction History
          </NavLink>
        </nav>
        
        {/* Logout Button */}
        <div className="mt-auto pt-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
