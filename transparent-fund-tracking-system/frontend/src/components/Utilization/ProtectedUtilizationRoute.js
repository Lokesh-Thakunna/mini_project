import React from "react";
import { Navigate } from "react-router-dom";
import { useUtilizationAuth } from "../../context/UtilizationAuthContext";

const ProtectedUtilizationRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUtilizationAuth();

  // Responsive loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md text-center w-full max-w-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
          <p className="text-sm sm:text-base text-gray-700">
            Verifying authentication…
          </p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/utilization/signin" replace />;
  }

  // Authorized
  return children;
};

export default ProtectedUtilizationRoute;
