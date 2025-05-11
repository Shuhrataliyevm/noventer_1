import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/employees.scss";
import Header from "../Header/header";
import LeftPage from "../LeftPage/leftpage";
import Footer from "../Footer/footer";

interface Employee {
    id: number;
    user_full_name: string;
    user_role: string;
    branch_name: string;
    position: string;
    salary: string;
    official_salary: string;
    start_time: string | null;
    end_time: string | null;
    user: {
        full_name: string;
        gender: string;
        phone_number: string;
        passport_number: string;
        jshshr: string;
        birth_date: string | null;
        salary_type: string | null;
        avatar?: string | null;
    };
}

interface Branch {
    id: number;
    name: string;
}

const branches: Branch[] = [
    { id: 1, name: "Uchtepa filiali 1" },
    { id: 2, name: "Chilonzor filiali 1" },
    { id: 3, name: "Yashnabod 1" },
];

const Employees = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<number>(1);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    passport_number: "",
    birth_date: "",
    salary_type: "official",
    gender: "male",
    jshshr: "", // 🔥 SHU YER YETISHMAYAPTI
});

    const limit = 10;
    const token = localStorage.getItem("access_token");

    const fetchEmployees = async () => {
        try {
            const offset = (page - 1) * limit;
            const res = await axios.get(
                `https://api.noventer.uz/api/v1/employee/employees/branch/${selectedBranch}/?limit=${limit}&offset=${offset}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setEmployees(res.data.results);
            setCount(res.data.count);
        } catch (error: any) {
            console.error("Error fetching employees:", error);
        }
    };

    const handleAddEmployee = async () => {
        try {
            await axios.post(
                "https://api.noventer.uz/api/v1/employee/employees/",
                {
                    user: {
                        full_name: formData.full_name,
                        phone_number: formData.phone_number,
                        passport_number: formData.passport_number,
                        birth_date: formData.birth_date,
                        gender: formData.gender,
                        salary_type: formData.salary_type,
                        jshshr: formData.jshshr,
                        avatar: null,
                    },
                    user_full_name: formData.full_name,
                    user_role: "employee",
                    branch_id: selectedBranch,
                    department_id: 1,
                    shift_id: 1,
                    branch_name: branches.find(b => b.id === selectedBranch)?.name || "",
                    branch_location: "",
                    position: "employee",
                    salary: "0",
                    official_salary: "0",
                    start_time: "08:00:00",
                    end_time: "17:00:00",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setIsModalOpen(false);
            fetchEmployees();
        } catch (err) {
            console.error("Error adding employee", err);
        }
    };


    useEffect(() => {
        fetchEmployees();
    }, [selectedBranch, page]);

    const filtered = employees.filter((emp) =>
        emp.user.full_name.toLowerCase().includes(search.toLowerCase())
    );

    const toggleSelectAll = () => {
        setSelectedIds(
            filtered.length === selectedIds.length ? [] : filtered.map((emp) => emp.id)
        );
    };

    const toggleSelectOne = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    return (
        <div className="employees">
            <Header />
            <LeftPage />
            <div className="empyese">
                <div className="filters">
                    <button className="add-button" onClick={() => setIsModalOpen(true)}>
                        + Xodim qo’shish
                    </button>
                    <div className="new">
                        <input
                            type="text"
                            placeholder="Ism bo'yicha qidirish"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(Number(e.target.value))}
                    >
                        {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select>
                </div>

                {isModalOpen && (
                    <div className="employee-modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>Yangi xodim qo‘shish</h2>
                                <button onClick={() => setIsModalOpen(false)}>×</button>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>F.I.SH</label>
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Telefon raqam</label>
                                    <input
                                        type="text"
                                        value={formData.phone_number}
                                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Passport raqami</label>
                                    <input
                                        type="text"
                                        value={formData.passport_number}
                                        onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tug‘ilgan sana</label>
                                    <input
                                        type="date"
                                        value={formData.birth_date}
                                        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Jinsi</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="male">Erkak</option>
                                        <option value="female">Ayol</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Maosh turi</label>
                                    <select
                                        value={formData.salary_type || "official"}
                                        onChange={(e) => setFormData({ ...formData, salary_type: e.target.value })}
                                    >
                                        <option value="official">Rasmiy</option>
                                        <option value="unofficial">Norasmiy</option>
                                    </select>
                                </div>
                            </div>
                            <button className="submit-btn" onClick={handleAddEmployee}>
                                Saqlash
                            </button>
                        </div>
                    </div>
                )}

                <div className="table-wrapper">
                    <table className="employees-table">
                        <thead>
                            <tr>
                                <th><input type="checkbox" checked={filtered.length === selectedIds.length} onChange={toggleSelectAll} /></th>
                                <th>F.I.SH</th>
                                <th>ROLE</th>
                                <th>PHONE</th>
                                <th>ISHGA QABUL QILUVCHI FILIAL</th>
                                <th>SMENASI</th>
                                <th>TUG‘ILGAN SANA</th>
                                <th>...</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((emp) => (
                                <tr key={emp.id}>
                                    <td><input type="checkbox" checked={selectedIds.includes(emp.id)} onChange={() => toggleSelectOne(emp.id)} /></td>
                                    <td>
                                        <div className="user-info">
                                            <img src={emp.user.avatar || "/icons/Avatar Images.svg"} alt={emp.user.full_name} className="employee-avatar" />
                                            <span className="user-name">{emp.user.full_name}</span>
                                        </div>
                                    </td>
                                    <td>{emp.user_role}</td>
                                    <td>{emp.user.phone_number}</td>
                                    <td>{emp.branch_name}</td>
                                    <td>{emp.start_time} - {emp.end_time}</td>
                                    <td>{emp.user.birth_date}</td>
                                    <td>...</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <button className="prev" onClick={() => setPage(page > 1 ? page - 1 : 1)}>&lt;</button>
                    {Array.from({ length: Math.ceil(count / limit) }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            className={num === page ? "active" : ""}
                            onClick={() => setPage(num)}
                        >
                            {num}
                        </button>
                    ))}
                    <button className="next" onClick={() => setPage(page < Math.ceil(count / limit) ? page + 1 : page)}>&gt;</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Employees;