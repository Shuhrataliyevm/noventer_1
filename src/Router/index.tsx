import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home/home";
import Login from "../pages/Login/login";
import Register from "../pages/Register/register";
import PrivateRoute from "./PrivateRoute";
import Error from "../pages/Error/error";
import About from "../pages/About/about";
import Footer from "../pages/Footer/footer";
import Header from "../pages/Header/header";
import LeftPage from "../pages/LeftPage/leftpage";
import Employe from "../pages/Employe/employe";
import Clients from "../pages/Clients/Clients";
import ShiftList from "../pages/ShiftList/ShiftList";

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/header" element={<Header />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/leftpage" element={<LeftPage />} />
            <Route path="/employe" element={<Employe />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/shiftlist" element={<ShiftList />} />

            <Route path="/" element={<PrivateRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>
            <Route path="*" element={<Error />} />
        </Routes>
    );
};

export default Router;
