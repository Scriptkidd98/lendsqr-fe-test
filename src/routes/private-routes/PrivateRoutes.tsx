import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';
    

const PrivateRoutes = ({ children } : { children: JSX.Element }) => {
    const isAuthenticated = !!localStorage.getItem("auth");


    return isAuthenticated ? ( children ) : ( <Navigate to="/login" replace /> )
}

export default PrivateRoutes