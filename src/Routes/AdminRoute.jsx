import React from "react";
import useAuth from "../Hooks/useAuth";
import Loader from "../Pages/Shared/Loader/Loader";
import useUserRole from "../Hooks/useUserRole";
import { Navigate, useLocation } from "react-router";

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  if (loading || roleLoading) {
    return <Loader />;
  }
  if (!user || role !== "admin") {
    return (
      <Navigate
        state={{ form: location.pathname }}
        to="/forbiddenAccess"
        replace
      />
    );
  }

  return children;
};

export default AdminRoute;
