import { useEffect, useState } from "react";
import "../../styles/employe.scss";
import axios from "axios";
import { Card } from "antd";

interface User {
    id: number;
    full_name: string;
    gender: string;
    birth_date: string;
    email: string;
    role: string;
    face_id: string | null;
    company_id: number;
    avatar: string | null;
    salary_type: string;
}

const Employe = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    window.location.href = "/login";
                    return;
                }

                const response = await axios.get("https://api.noventer.uz/api/v1/accounts/me/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user:", error);
                const mockUser: User = {
                    id: 6,
                    full_name: "Nurillo Ubaydullayev",
                    gender: "male",
                    birth_date: "2025-03-10",
                    email: "nurillo@example.com",
                    role: "director",
                    face_id: null,
                    company_id: 2,
                    avatar: "http://api.noventer.uz/media/users/2025/05/verified.png",
                    salary_type: "official",
                };
                setUser(mockUser);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!user) {
        return <div className="error">Foydalanuvchi topilmadi</div>;
    }

    return (
        <div className="client-profile">
            <div className="profile-header">
                <div className="profile-info">
                    <div className="profile-avatar-section">
                        <img src={user.avatar || "/icons/avatar.svg"} alt="Avatar" />
                        <div className="profile-name-section">
                            <p className="welcome-text">Xush kelibsiz!</p>
                            <h1 className="profile-name">{user.full_name}</h1>
                            <button className="role-badge">{user.role}</button>
                        </div>
                    </div>
                    <Card className="finance-card">
                        <div className="finance-content">
                            <div className="finance-details">
                                <p className="finance-title">Finance card</p>
                                <p className="finance-id">ID: {user.id}</p>
                                <p className="finance-balance-label">Current balance:</p>
                                <h2 className="finance-balance">557 000 so'm</h2>
                            </div>
                        </div>
                        <div className="img">
                            <img src="/icons/Group 313.svg" alt="#" />
                        </div>
                    </Card>
                </div>
            </div>

            <div className="stats-section">
                <Card className="stat-card">
                    <div className="stat-content">
                        <p className="stat-title">
                            <img src="/images/Icon2.png" alt="#" />
                            <span>Vazifalar</span>
                        </p>
                        <h2 className="stat-value">0</h2>
                        <p className="stat-subtitle">Group and individual</p>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-content">
                        <p className="stat-title">
                            <img src="/images/Icon3.png" alt="#" />
                            <span>Rasmiy oylik</span>
                        </p>
                        <h2 className="stat-value">
                            {user.salary_type === "official" ? "1 218 000" : "0"}{" "}
                            <span className="currency">so'm</span>
                        </h2>
                        <p className="stat-subtitle">Rasmiy oylik ma'lumotlari</p>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-content">
                        <p className="stat-title">
                            <img src="/images/Icon4.png" alt="#" />
                            <span>Norasmiy oylik</span>
                        </p>
                        <h2 className="stat-value">
                            {user.salary_type === "unofficial" ? "1 218 000" : "0"}{" "}
                            <span className="currency">so'm</span>
                        </h2>
                        <p className="stat-subtitle">Norasmiy oylik ma'lumotlari</p>
                    </div>
                </Card>
            </div>

            <Card className="info-section">
                <div className="info-header">
                    <img src="/images/Icon1.png" alt="#" />
                    <h2 className="info-title">Ma'lumotlar</h2>
                </div>
                <div className="info-content">
                    <div className="info-column">
                        <div className="info-item">
                            <p className="info-label">Email: {user.email}</p>
                        </div>
                        <div className="info-item">
                            <p className="info-label">Tug‘ilgan sana: {user.birth_date}</p>
                        </div>
                        <div className="info-item">
                            <p className="info-label">Jinsi: {user.gender === "male" ? "Erkak" : "Ayol"}</p>
                        </div>
                    </div>
                    <div className="info-column">
                        <div className="info-item">
                            <p className="info-label">Role: {user.role}</p>
                        </div>
                        <div className="info-item">
                            <p className="info-label">Company ID: {user.company_id}</p>
                        </div>
                        <div className="info-item">
                            <p className="info-label">Face ID: {user.face_id || "Mavjud emas"}</p>
                        </div>
                        <div className="info-item">
                            <p className="info-label">Lizensiya: Yuklab olish</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Employe;
