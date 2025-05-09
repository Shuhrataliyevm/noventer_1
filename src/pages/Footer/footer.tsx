import "../../styles/footer.scss";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footers">
                <div className="btn">
                    <button onClick={() => window.location.href = "/login"}> <img src="/icons/logout.svg" alt="#" /> Yopish</button>
                </div>
                <div className="text">
                    <h5>crm.noventer platformasi NovEnter jamosi tomonidan yaratildi  | 2025 © <span>NovEnter</span></h5>
                </div>
                <p>v 1.0.0 </p>
            </div>
        </footer>
    );
};

export default Footer;
