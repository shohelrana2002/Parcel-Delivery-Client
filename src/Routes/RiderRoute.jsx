import React from "react";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";
import Loader from "../Pages/Shared/Loader/Loader";
import { Navigate, useLocation } from "react-router";

const RiderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, authLoading } = -useUserRole();
  const location = useLocation();
  if (loading || authLoading) {
    return <Loader />;
  }
  if (!user || role !== "rider") {
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

export default RiderRoute;
