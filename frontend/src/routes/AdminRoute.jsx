import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return user.role === "admin"
    ? children
    : <Navigate to="/employee" replace />;
};

export default AdminRoute;
