import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Header/header";
import Footer from "../Footer/footer";
import LeftPage from "../LeftPage/leftpage";
import "../../styles/shiftlist.scss";

interface Shift {
    id: number;
    name: string;
    branch: number;
    branch_name: string;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
}

const Shifts = () => {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchShifts = async () => {
            try {
                const access_token = localStorage.getItem("access_token"); 
                const response = await axios.get(
                    "https://api.noventer.uz/api/v1/company/shifts/1/",
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    }
                );
                setShifts(response.data);
            } catch (error) {
                console.error("Error fetching shifts:", error);
            }
        };
        fetchShifts();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const filteredShifts = shifts.filter(shift =>
        shift.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="shifts-container">
            <Header />
            <LeftPage />

            <div className="input">
                <form className="from">
                    <input
                        type="text"
                        placeholder="Search by shift name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
                <div className="add-btn">
                    <button>+ Smena qo'shish</button>
                </div>
            </div>

            <div className="shifts-table">
                <table>
                    <thead>
                        <tr>
                            <th>Smena Nomi</th>
                            <th>Filial</th>
                            <th>Boshlanish Vaqti</th>
                            <th>Tugash Vaqti</th>
                            <th>Yaratilgan sana</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredShifts.map((shift) => (
                            <tr key={shift.id}>
                                <td>{shift.name}</td>
                                <td>{shift.branch_name}</td>
                                <td>{shift.start_time}</td>
                                <td>{shift.end_time}</td>
                                <td>{formatDate(shift.created_at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Footer />
        </div>
    );
};

export default Shifts;
