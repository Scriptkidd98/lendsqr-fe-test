import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicRoutes from "../public-routes/PublicRoutes";
import PrivateRoutes from "../private-routes/PrivateRoutes";
import Login from "../../pages/login/Login";
import Dashboard from "../../pages/dashboard/Dashboard";

const AppRouter = () => {
  return (
    <Router>
        <Routes>
            <Route path="/login" element={
                <PublicRoutes>
                    <Login />
                </PublicRoutes>
            }/>
            

            <Route path="/dashboard" element={
                <PrivateRoutes>
                    <Dashboard />
                </PrivateRoutes>
            }/>
        </Routes>
    </Router>
  )
}

export default AppRouter