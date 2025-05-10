import "../../styles/input.scss";

interface InputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    type: string;
}

const Input = ({ value, onChange, placeholder, type }: InputProps) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="custom-input"
        />
    );
};

export default Input;
