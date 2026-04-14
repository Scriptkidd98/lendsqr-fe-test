import { Navigate, Outlet } from "react-router-dom";

const PublicRoutes = () => {
  const isAuthenticated = !!localStorage.getItem("auth");
  
  return isAuthenticated ? <Navigate to="/dashboard/users" replace /> : <Outlet />;
};

export default PublicRoutes;