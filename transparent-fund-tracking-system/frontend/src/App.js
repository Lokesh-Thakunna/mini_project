import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddScheme from "./components/AddScheme";
import UseFund from "./components/UseFund";
import ViewSchemes from "./components/ViewSchemes";
import TransactionHistory from "./components/TransactionHistory";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
          <h1 className="text-xl font-bold">Transparent Fund Tracker 💰</h1>
          <div className="space-x-4">
            <Link to="/" className="hover:underline">Add Scheme</Link>
            <Link to="/use-fund" className="hover:underline">Use Fund</Link>
            <Link to="/view-schemes" className="hover:underline">View Schemes</Link>
            <Link to="/history" className="hover:underline">Transaction History</Link>
            <Link to="/admin" className="hover:underline">Admin</Link>
          </div>
        </nav>

        <div className="p-6">
          <Routes>
            <Route path="/" element={<AddScheme />} />
            <Route path="/use-fund" element={<UseFund />} />
            <Route path="/view-schemes" element={<ViewSchemes />} />
            <Route path="/history" element={<TransactionHistory />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
