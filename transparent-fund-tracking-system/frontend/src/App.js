import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { UtilizationAuthProvider } from "./context/UtilizationAuthContext";
import { PublicAuthProvider } from "./context/PublicAuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedUtilizationRoute from "./components/Utilization/ProtectedUtilizationRoute";
import ProtectedPublicRoute from "./components/Public/ProtectedPublicRoute";

/* ===== ADMIN ===== */
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AddScheme from "./components/Admin/AddScheme";
import UseFund from "./components/Admin/UseFund";
import ViewSchemes from "./components/Admin/ViewSchemes";
import TransactionHistory from "./components/Admin/TransactionHistory";
import ManageUtilizationRequests from "./components/Admin/ManageUtilizationRequests";
import GrievanceReports from "./components/Admin/GrievanceReports";

/* ===== UTILIZATION ===== */
import UtilizationDashboard from "./components/Utilization/UtilizationDashboard";
import UtilizationRequestsList from "./components/Utilization/UtilizationRequestsList";
import FundUtilizationRequestForm from "./components/Utilization/FundUtilizationRequestForm";
import UtilizationRequestDetail from "./components/Utilization/UtilizationRequestDetail";
import SignIn from "./components/Utilization/SignIn";
import SignUp from "./components/Utilization/SignUp";

/* ===== PUBLIC ===== */
import PublicDashboard from "./components/Public/PublicDashboard";
import SchemesView from "./components/Public/SchemesView";
import PublicTransactionHistory from "./components/Public/PublicTransactionHistory";
import GrievanceSubmission from "./components/Public/GrievanceSubmission";
import ReportDownload from "./components/Public/ReportDownload";
import PublicSignIn from "./components/Public/PublicSignIn";
import PublicSignUp from "./components/Public/PublicSignUp";
import MyGrievances from "./components/Public/MyGrievances";

/* ===== HOME ===== */
import Home from "./pages/Home";

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 text-gray-900">

          {/* ================= NAVBAR ================= */}
          <nav className="bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 text-white shadow-md">
            <div className="max-w-8xl mx-auto px-6 py-6 flex justify-between items-center">
              <Link to="/" className="text-lg sm:text-xl font-bold">
                Transparent Fund Tracker 💰
              </Link>

              {/* Desktop Menu */}
              <div className="hidden md:flex space-x-3">
                <NavLink to="/">🏠 Home</NavLink>
                <NavLink to="/public/schemes">👁️ Public Portal</NavLink>
                <NavLink to="/utilization/requests">📋 Fund Utilization</NavLink>
                <NavLink to="/admin">🔐 Admin Portal</NavLink>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-2xl"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                ☰
              </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
              <div className="md:hidden bg-blue-700 px-4 pb-4 space-y-2">
                <MobileLink to="/" setMenuOpen={setMenuOpen}>🏠 Home</MobileLink>
                <MobileLink to="/public/schemes" setMenuOpen={setMenuOpen}>👁️ Public Portal</MobileLink>
                <MobileLink to="/utilization/requests" setMenuOpen={setMenuOpen}>📋 Fund Utilization</MobileLink>
                <MobileLink to="/admin" setMenuOpen={setMenuOpen}>🔐 Admin Portal</MobileLink>
              </div>
            )}
          </nav>

          {/* ================= ROUTES ================= */}
          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/admin" element={<AdminLogin />} />

            <Route
              path="/admin/dashboard/*"
              element={
                <ProtectedRoute>
                  <div className="p-4 sm:p-6">
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
              <Route path="manage-requests" element={<ManageUtilizationRequests />} />
              <Route path="grievance-reports" element={<GrievanceReports />} />
            </Route>

            <Route
              path="/utilization/*"
              element={
                <UtilizationAuthProvider>
                  <div className="p-4 sm:p-6">
                    <UtilizationDashboard />
                  </div>
                </UtilizationAuthProvider>
              }
            >
              <Route path="signin" element={<SignIn />} />
              <Route path="signup" element={<SignUp />} />
              <Route
                index
                element={
                  <ProtectedUtilizationRoute>
                    <Navigate to="/utilization/requests" replace />
                  </ProtectedUtilizationRoute>
                }
              />
              <Route
                path="requests"
                element={
                  <ProtectedUtilizationRoute>
                    <UtilizationRequestsList />
                  </ProtectedUtilizationRoute>
                }
              />
              <Route
                path="requests/:id"
                element={
                  <ProtectedUtilizationRoute>
                    <UtilizationRequestDetail />
                  </ProtectedUtilizationRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedUtilizationRoute>
                    <FundUtilizationRequestForm />
                  </ProtectedUtilizationRoute>
                }
              />
            </Route>

            <Route
              path="/public/*"
              element={
                <PublicAuthProvider>
                  <div className="p-4 sm:p-6">
                    <PublicDashboard />
                  </div>
                </PublicAuthProvider>
              }
            >
              <Route index element={<Navigate to="/public/schemes" replace />} />
              <Route path="schemes" element={<SchemesView />} />
              <Route path="transactions" element={<PublicTransactionHistory />} />
              <Route path="reports" element={<ReportDownload />} />
              <Route path="signin" element={<PublicSignIn />} />
              <Route path="signup" element={<PublicSignUp />} />
              <Route
                path="grievance"
                element={
                  <ProtectedPublicRoute>
                    <GrievanceSubmission />
                  </ProtectedPublicRoute>
                }
              />
              <Route
                path="my-grievances"
                element={
                  <ProtectedPublicRoute>
                    <MyGrievances />
                  </ProtectedPublicRoute>
                }
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

/* ================= SMALL COMPONENTS ================= */

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="px-3 py-2 rounded hover:bg-white hover:bg-opacity-20 transition"
  >
    {children}
  </Link>
);

const MobileLink = ({ to, children, setMenuOpen }) => (
  <Link
    to={to}
    onClick={() => setMenuOpen(false)}
    className="block px-3 py-2 rounded text-white hover:bg-white hover:bg-opacity-20 transition"
  >
    {children}
  </Link>
);

export default App;
