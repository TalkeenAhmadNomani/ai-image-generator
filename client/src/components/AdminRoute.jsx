import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // If not logged in at all, redirect to login
    return <Navigate to="/login" />;
  }

  if (user.result.role !== "admin") {
    // If logged in but not an admin, redirect to home
    return <Navigate to="/" />;
  }

  // If logged in and is an admin, render the child component (the dashboard)
  return children;
};

export default AdminRoute;
