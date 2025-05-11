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

const ShiftList = () => {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [branchFilter, setBranchFilter] = useState<number | "">("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newShift, setNewShift] = useState({
        name: "",
        branch: 0,
        branch_name: "",
        start_time: "",
        end_time: ""
    });

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
        try {
            const access_token = localStorage.getItem("access_token");
            await axiosInstance.delete(
                `https://api.noventer.uz/api/v1/company/shift-detail/${id}/`,
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
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewShift((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const access_token = localStorage.getItem("access_token");

            const shiftData = {
                ...newShift,
                start_time: new Date(newShift.start_time).toISOString(),
                end_time: new Date(newShift.end_time).toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            await axiosInstance.post(
                "https://api.noventer.uz/api/v1/company/shift-create/",
                shiftData,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            alert("Shift added successfully!");
            fetchShifts();
            toggleModal();
        } catch (error) {
            console.error("Error adding shift:", error);
            alert("Error adding shift. Please try again.");
        }
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
                    <button onClick={toggleModal}>+ Smena</button>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add New Shift</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                value={newShift.name}
                                onChange={handleInputChange}
                                placeholder="Shift Name"
                                required
                            />
                            <input
                                type="number"
                                name="branch"
                                value={newShift.branch}
                                onChange={handleInputChange}
                                placeholder="Branch ID"
                                required
                            />
                            <input
                                type="text"
                                name="branch_name"
                                value={newShift.branch_name}
                                onChange={handleInputChange}
                                placeholder="Branch Name"
                                required
                            />
                            <input
                                type="datetime-local"
                                name="start_time"
                                value={newShift.start_time}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="datetime-local"
                                name="end_time"
                                value={newShift.end_time}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="modal-buttons">
                                <button type="submit">Add Shift</button>
                                <button type="button" onClick={toggleModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                                                onClick={() => alert("Edit functionality for shift will go here")}
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

export default ShiftList;
