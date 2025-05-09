import "../../styles/error.scss";
const error = () => {
    
    return (
        <div className="container">
            <img src="/images/error pictures.jpg" alt="#" />
            <h1>404</h1>
            <p>Oops! Page Not Found</p>
            <button onClick={() => window.location.href = "/"}>Bosh sahifaga qaytish</button>
        </div>
    )
}

export default error