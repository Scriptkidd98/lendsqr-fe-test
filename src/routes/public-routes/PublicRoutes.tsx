import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoutes = ({ children } : { children: JSX.Element }) => {
    const isAuthenticated = !!localStorage.getItem("auth");


    return isAuthenticated ? ( <Navigate to="/dashboard" replace /> ) : ( children )
}

export default PublicRoutes