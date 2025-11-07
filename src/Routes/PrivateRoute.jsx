import React from "react";
import useAuth from "../Hooks/useAuth";
import { useLocation } from "react-router";
import Loader from "../Pages/Shared/Loader/Loader";
import { Navigate } from "react-router";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Loader />;

  if (!user) {
    return (
      <Navigate state={{ from: location.pathname }} replace to={"/login"} />
    );
  }

  return children;
};

export default PrivateRoute;
