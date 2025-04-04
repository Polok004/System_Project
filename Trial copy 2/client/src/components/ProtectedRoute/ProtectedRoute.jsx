import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";


const ProtectedRoute = ({ children, role }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser || (role && currentUser.role !== role)) {
    return <Navigate to="/login" />;
  }

  return children;
};


export default ProtectedRoute;
