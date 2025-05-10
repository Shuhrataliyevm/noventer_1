import "../../styles/button.scss";

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

const Button = ({ onClick, children, className = "" }: ButtonProps) => {
    return (
        <button onClick={onClick} className={`custom-button ${className}`}>
            {children}
        </button>
    );
};

export default Button;
