import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AddScheme from "./components/Admin/AddScheme";
import UseFund from "./components/Admin/UseFund";
import ViewSchemes from "./components/Admin/ViewSchemes";
import TransactionHistory from "./components/Admin/TransactionHistory";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 text-gray-900">
          {/* Main Navigation */}
          <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
            <h1 className="text-xl font-bold">Transparent Fund Tracker 💰</h1>
            <div className="space-x-4">
              <Link to="/admin" className="hover:underline">
                Admin
              </Link>
            </div>
          </nav>

          {/* Main Routes */}
          <Routes>
            {/* Admin Login - Exact path match */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* Admin Dashboard and nested routes - Protected */}
            <Route
              path="/admin/dashboard/*"
              element={
                <ProtectedRoute>
                  <div className="p-6">
                    <AdminDashboard />
                  </div>
                </ProtectedRoute>
              }
            >
              <Route index element={<ViewSchemes />} />
              <Route path="add-scheme" element={<AddScheme />} />
              <Route path="use-fund" element={<UseFund />} />
              <Route path="view-schemes" element={<ViewSchemes />} />
              <Route path="transactions" element={<TransactionHistory />} />
            </Route>
            
            {/* Default redirect - if path doesn't match, redirect to home */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

