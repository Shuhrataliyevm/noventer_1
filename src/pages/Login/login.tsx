import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setTokens } from "../../utils/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { toast } from "sonner";
import "./login.scss";

interface LoginFormData {
    phone_number: string;
    password: string;
}

interface LoginResponse {
    message: any;
    detail: any;
    id: number;
    phone_number: string;
    tokens: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<LoginFormData>({
        phone_number: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!formData.phone_number || !formData.password) {
            toast.error("Iltimos, telefon va parolni to‘ldiring.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("https://api.noventer.uz/api/v1/accounts/login/", {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone_number: formData.phone_number.trim(),
                    password: formData.password.trim(),
                }),
            });

            const data: LoginResponse = await res.json();

            if (!res.ok) {
                const errorMessage = data.detail || data.message || "Telefon yoki parol noto‘g‘ri!";
                throw new Error(errorMessage);
            }

            setTokens(data.tokens, data.tokens);
            localStorage.setItem("phone", formData.phone_number);
            toast.success("Muvaffaqiyatli kirdingiz!");
            navigate("/");
        } catch (err) {
            const message = (err as Error).message;
            toast.error(message);
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-background" />
            <div className="login-content">
                <div className="login-left">
                    <div className="login-image">
                        <img src="/icons/login image.svg" alt="Login" />
                    </div>
                </div>

                <div className="login-right">
                    <div className="logo-container">
                        <img src="/icons/Union.svg" alt="Logo" />
                    </div>
                    <h2>NovEnter</h2>
                    <p className="login-description">
                        Crm tizim bilan biznesingizni rivojlantiring
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                id="phone_number"
                                type="text"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                placeholder="Telefon raqamingizni kiriting"
                            />
                        </div>

                        <div className="form-group">
                            <div className="password-container">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Parolingizni kiriting"
                                />
                                <div
                                    className="eye-icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>
                        </div>


                        {error && <p className="error-message">{error}</p>}

                        <button className="login-button" type="submit" disabled={isLoading}>
                            {isLoading ? "Loading..." : "Tizimga kirish"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
