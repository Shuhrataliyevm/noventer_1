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
    const [branchFilter, setBranchFilter] = useState<number | "">("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const axiosInstance = axios.create({
        baseURL: "https://api.noventer.uz/api/v1",
    });

    axiosInstance.interceptors.request.use((config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    axiosInstance.interceptors.response.use(
        (res) => res,
        async (error) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                const refreshToken = localStorage.getItem("refresh_token");

                try {
                    const { data } = await axios.post(
                        "https://api.noventer.uz/api/v1/auth/jwt/refresh/",
                        { refresh: refreshToken }
                    );
                    localStorage.setItem("access_token", data.access);
                    originalRequest.headers.Authorization = `Bearer ${data.access}`;
                    return axios(originalRequest);
                } catch (err) {
                    console.error("Refresh token expired or error:", err);
                    return Promise.reject(err);
                }
            }
            return Promise.reject(error);
        }
    );

    const fetchShifts = async () => {
        try {
            const access_token = localStorage.getItem("access_token");
            const response = await axiosInstance.get(
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

    useEffect(() => {
        fetchShifts();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date
            .getDate()
            .toString()
            .padStart(2, "0")}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getFullYear()} ${date
            .getHours()
            .toString()
            .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm("Are you sure you want to delete this shift?");
        if (confirmed) {
            try {
                const access_token = localStorage.getItem("access_token");
                await axiosInstance.delete(
                    `https://api.noventer.uz/api/v1/company/shifts/${id}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    }
                );
                alert("Shift deleted successfully!");
                fetchShifts(); 
            } catch (error) {
                console.error("Error deleting shift:", error);
            }
        }
    };

    const handleEdit = (id: number) => {
        alert(`Edit functionality for shift ${id} would go here.`);
    };

    const filteredShifts = shifts.filter((shift) =>
        shift.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (branchFilter ? shift.branch === branchFilter : true)
    );

    const indexOfLastShift = currentPage * itemsPerPage;
    const indexOfFirstShift = indexOfLastShift - itemsPerPage;
    const currentShifts = filteredShifts.slice(indexOfFirstShift, indexOfLastShift);

    const totalPages = Math.ceil(filteredShifts.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

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
                    <select
                        className="branch-select"
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(Number(e.target.value) || "")}
                    >
                        <option value="">All Branches</option>
                        {shifts.map((shift) => (
                            <option key={shift.branch} value={shift.branch}>
                                {shift.branch_name}
                            </option>
                        ))}
                    </select>
                </form>
                <div className="add-btn">
                    <button>+ Add Shift</button>
                </div>
            </div>

            <div className="newtable">
                <div className="shifts-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Shift Name</th>
                                <th>Branch</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentShifts.map((shift) => (
                                <tr key={shift.id}>
                                    <td>{shift.name}</td>
                                    <td>{shift.branch_name}</td>
                                    <td>{shift.start_time}</td>
                                    <td>{shift.end_time}</td>
                                    <td>{formatDate(shift.created_at)}</td>
                                    <td>
                                        <div className="button">
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEdit(shift.id)}
                                            >
                                                <img src="/icons/edit-button-image.svg" alt="#" />
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(shift.id)}
                                            >
                                                <img src="/icons/delete-button-image.svg" alt="#" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Shifts;
