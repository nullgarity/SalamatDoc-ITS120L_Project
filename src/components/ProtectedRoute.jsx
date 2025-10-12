import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // While user data is loading
  if (loading) return <p>Loading...</p>;

  // If no user, redirect to login and remember where they came from
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are defined and the user's role isn't allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(profile?.role)) {
    console.warn(`Unauthorized: ${profile?.role} cannot access this page.`);
    return <Navigate to="/login" replace />;
  }

  // Render the page
  return children;
}
