import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

const UserProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <>Loading...</>;
//if not logged In 
  if (!user) return <Navigate to="/login" replace />;

  //if not an user 
  if(user.role !== "user") return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default UserProtectedRoute;