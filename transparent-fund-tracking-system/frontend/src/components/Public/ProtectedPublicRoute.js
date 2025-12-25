import React from "react";
import { Navigate } from "react-router-dom";
import { usePublicAuth } from "../../context/PublicAuthContext";

const ProtectedPublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = usePublicAuth();

  // Loading screen (fully responsive)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md text-center w-full max-w-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
          <p className="text-sm sm:text-base text-gray-700">
            Verifying authentication…
          </p>
        </div>
      </div>
    );
  }

  // Authenticated → allow access
  if (isAuthenticated) {
    return children;
  }

  // Not authenticated → redirect
  return <Navigate to="/public/signin" replace />;
};

export default ProtectedPublicRoute;
