import { Link } from "react-router-dom";
import "../../styles/header.scss";
const header = () => {
    return (
        <div className="header">
            <div className="text-logo">
                <Link to={"/"}> <img src="/icons/Phoenix Logo.svg" alt="#" /></Link>
            </div>
            <div className="header-links">
                <input type="text" placeholder="Search" />
            </div>
            <div className="header-btn">
                <img src="/icons/Navigation Menu Buttons and user menu.svg" alt="#" />
            </div>
        </div>
    );
}

export default header