import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "../public-routes/PublicRoutes";
import PrivateRoutes from "../private-routes/PrivateRoutes";
import Login from "../../pages/login/Login";
import Users from "../../pages/users/Users";
import User from "../../pages/user/User";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard">
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<User />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;