// import "../../styles/employe.scss"
// const employe = () => {
//     return (
//         <div>
//             {/* <div id="names">
//                 <div className="name">
//                     <img src="/icons/avatar.svg" alt="#" />
//                     <h1>Sheroz Turdiyev</h1>
//                     <br />
//                     <button>Rahbar</button>
//                 </div>
//             </div> */}
//         </div>
//     )
// }

// export default employe
import { useEffect, useState } from "react";
import "../../styles/home.scss";
import { getAccessToken, refreshAccessToken, removeTokens } from "../../utils/auth";

interface User {
    id: number;
    full_name: string;
    gender: string;
    birth_date: string;
    email: string;
    role: string;
    face_id: string | null;
    company_id: number | string;
    avatar: string;
    salary_type: string;
}

const Employe = () => {
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserWithToken = async (token: string) => {
        const response = await fetch("/api/v2/accounts/me/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Xatolik: ${response.status}`);
        }

        const data: User = await response.json();
        return data;
    };

    const fetchUser = async () => {
        const accessToken = getAccessToken();

        if (!accessToken) {
            console.warn("Token mavjud emas. Foydalanuvchi tizimga kirmagan.");
            setLoading(false);
            return;
        }

        try {
            const user = await fetchUserWithToken(accessToken);
            setUserData(user);
        } catch (error: any) {
            if (error.message.includes("401")) {
                try {
                    const newToken = await refreshAccessToken();
                    if (!newToken) throw new Error("Token yangilanmadi");
                    const user = await fetchUserWithToken(newToken);
                    setUserData(user);
                } catch (refreshError) {
                    console.error("Token yangilashda xatolik:", refreshError);
                    removeTokens();
                }
            } else {
                console.error("Foydalanuvchini olishda xatolik:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading) return <div>Yuklanmoqda...</div>;
    if (!userData) return <div>Foydalanuvchi tizimga kirmagan yoki ma'lumotlar yo‘q.</div>;

    return (
        <div className="user-card">
            <h2>Foydalanuvchi ma'lumotlari</h2>
            <ul>
                {Object.entries(userData).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong> {String(value)}
                    </li>
                ))}
            </ul>

            <button
                onClick={() => {
                    removeTokens();
                    setUserData(null);
                }}
            >
                Chiqish
            </button>
        </div>
    );

};

export default Employe;
