import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const isUserAuthenticated = () => {
  const token = sessionStorage.getItem("token");
  const hasLoggedCookie = document.cookie
    .split("; ")
    .some((cookie) => cookie.trim() === "logged=yes");
  return token && hasLoggedCookie;
};

const ProtectedRoute: React.FC = () => {
  return isUserAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
