import Footer from "../Footer/footer";
import Header from "../Header/header";
import LeftPage from "../LeftPage/leftpage";
import "../../styles/home.scss";
import Employe from "../Employe/employe";
const Home = () => {
    return (
        <div>
            <Header />
            <LeftPage />
            <Employe />
            <Footer />
        </div>
    )
}

export default Home;