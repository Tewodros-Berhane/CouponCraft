import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loader from "./components/ui/Loader";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" aria-busy="true">
        <Loader label="Loading session" showLabel />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/business-login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
