import { Link } from "react-router-dom"
import "../../styles/leftpage.scss"
const LeftPage = () => {
    return (
        <div>
            <div className="LeftPages">
                <div className="pages">
                    <div className="link">
                    <Link to="/"><p> <img src="/icons/Icon.svg" alt="#" /> Xodimlar ro’yxati</p></Link>                
                    <Link to="#"><p> <img src="/icons/Icon.svg" alt="#" /> Xodimlar davomati</p></Link>
                    <Link to="/clients"><p> <img src="/icons/Icon.svg" alt="#" /> Mijozlar</p></Link>
                    <Link to="#"><p> <img src="/icons/Icon.svg" alt="#" /> Oylik hisobot</p></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftPage