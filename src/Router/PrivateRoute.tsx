import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute: React.FC = () => {
    const token: string | null = localStorage.getItem("token");

    return token && token !== "null" ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
