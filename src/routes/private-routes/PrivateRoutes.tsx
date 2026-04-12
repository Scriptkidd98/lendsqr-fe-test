import type { JSX } from "react";
import { Navigate } from "react-router-dom";
    

const PrivateRoutes = ({ children } : { children: JSX.Element }) => {
    const isAuthenticated = true;


    return isAuthenticated ? ( children ) : ( <Navigate to="/login" replace /> )
}

export default PrivateRoutes