import React from "react";
import useAuth from "../Hooks/useAuth";
import { useNavigate } from "react-router";
import Loader from "../Pages/Shared/Loader/Loader";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  if (!user) {
    return navigate("/login");
  }
  if (loading) return <Loader />;

  return { children };
};

export default PrivateRoute;
