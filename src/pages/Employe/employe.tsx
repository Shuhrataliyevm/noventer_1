import { useEffect, useState } from "react";
import { List, Coins, Calendar, Info, Badge } from "lucide-react";
import "../../styles/employe.scss";

import axios from "axios";
import { Card } from "antd";

interface Client {
    id: number;
    branch: number | null;
    branch_name?: string;
    name: string;
    phone: string;
    avatar: string | null;
    license_file: string | null;
    created_at: string;
    updated_at: string;
    email?: string;
    birthday?: string;
    gender?: string;
    company?: string;
    inn?: string;
    registration_date?: string;
}

const Employe = () => {
    const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await axios.get('https://api.noventer.uz/api/v1/accounts/me/');
                setClient(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching client:', error);
                const mockClient: Client = {
                    id: 1,
                    branch: 1,
                    branch_name: "Head Office",
                    name: "Sheroz Turdiyev",
                    phone: "+998 99 966 7363",
                    avatar: null,
                    license_file: "license.pdf",
                    created_at: "2023-02-28T08:56:00",
                    updated_at: "2023-02-28T08:56:00",
                    email: "example@gmail.com",
                    birthday: "28.02.2001",
                    gender: "Erkak",
                    company: "NovEnter",
                    inn: "321119912345",
                    registration_date: "28.02.2001"
                };
                setClient(mockClient);
                setLoading(false);
            }
        };

        fetchClient();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!client) {
        return <div className="error">User not found</div>;
    }

    return (
        <div className="client-profile">
            <div className="profile-header">
                <img src="/icons/Group 313.svg" alt="#" />
                <div className="profile-info">
                    <div className="profile-avatar-section">
                        <img src="/icons/avatar.svg" alt="#" />
                        <div className="profile-name-section">
                            <p className="welcome-text">Xush kelibsiz!</p>
                            <h1 className="profile-name">{client.name}</h1>
                            <button className="role-badge">Rahbar</button>
                        </div>
                    </div>
                    <Card className="finance-card">
                        <div className="finance-content">
                            <div className="finance-details">
                                <p className="finance-title">Finance card</p>
                                <p className="finance-id">ID: 0989736</p>
                                <p className="finance-balance-label">Current balance:</p>
                                <h2 className="finance-balance">557 000 so'm</h2>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="stats-section">
                <Card className="stat-card">
                    <div className="stat-content">
                        <p className="stat-title">
                            <List className="stat-icon" />
                            Vazifalar</p>
                        <h2 className="stat-value">0</h2>
                        <p className="stat-subtitle">Group and individual</p>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-content">
                        <p className="stat-title">
                            <Coins className="stat-icon" />
                            Rasmiy oylik</p>
                        <h2 className="stat-value">0 <span className="currency">so'm</span></h2>
                        <p className="stat-subtitle">1 218 000 so'm</p>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-content">
                        <p className="stat-title">
                            <Calendar className="stat-icon" />
                            Norasmiy oylik</p>
                        <h2 className="stat-value">0 <span className="currency">so'm</span></h2>
                        <p className="stat-subtitle">1 218 000 so'm</p>
                    </div>
                </Card>
            </div>

            <Card className="info-section">
                <div className="info-header">
                    <Info className="info-icon" />
                    <h2 className="info-title">Malumotlar</h2>
                </div>
                <div className="info-content">
                    <div className="info-column">
                        <div className="info-item">
                            <p className="info-label">Telefon raqami:{client.phone}</p>
                        </div>
                        <div className="info-item">
                            <p className="info-label">email:{client.email || "example@gmail.com"}</p>
                        </div>
                        <div className="info-item">
                            <p className="info-label">Birthday:{client.birthday || "28.02.2001"}</p>
                        </div>
                        <div className="info-item">
                            <p className="info-label">Gender:{client.gender || "Erkak"}</p>
                        </div>
                    </div>
                    <div className="info-column">
                        <div className="info-item">
                            <p className="info-label">Kompaniya nomi:{client.company || client.branch_name || "NovEnter"}</p>
                        </div>
                        <div className="info-item">
                            <p className="info-label">INN:{client.inn || "321119912345"}</p>
                        </div>
                        <div className="info-item">
                            <p className="info-label">Ro'yxatdan o'tgan sana:{client.registration_date || "28.02.2001"}</p>
                        </div>
                        <div className="info-item">
                            <p className="info-label">Lizensiya:Yuklab olish</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Employe;