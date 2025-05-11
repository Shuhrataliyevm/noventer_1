import React, { useEffect, useState } from "react";
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
            if (error.response?.status === 401) {
                console.error("Access token is invalid or expired.");
            } else {
                console.error("Error fetching employees:", error);
            }
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [selectedBranch, page]);

    const filtered = employees.filter((emp) =>
        emp.user.full_name.toLowerCase().includes(search.toLowerCase())
    );

    const toggleSelectAll = () => {
        if (filtered.length === selectedIds.length) {
            setSelectedIds([]);
        } else {
            const allIds = filtered.map((emp) => emp.id);
            setSelectedIds(allIds);
        }
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
                    <button className="add-button">+ Xodim qo’shish</button>
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
                    <button className="newsbitn">
                        <img src="/icons/button-svg.svg" alt="#" />
                    </button>
                </div>

                <div className="table-wrapper">
                    <table className="employees-table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={
                                            filtered.length > 0 &&
                                            filtered.length === selectedIds.length
                                        }
                                        onChange={toggleSelectAll}
                                    />
                                </th>
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
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(emp.id)}
                                            onChange={() => toggleSelectOne(emp.id)}
                                        />
                                    </td>
                                    <td>
                                        <div className="user-info">
                                            <img
                                                src={emp.user.avatar || "/icons/Avatar Images.svg"}
                                                alt={emp.user.full_name}
                                                className="employee-avatar"
                                            />
                                            <span className="user-name">{emp.user.full_name}</span>
                                        </div>
                                    </td>
                                    <td>{emp.user_role}</td>
                                    <td>{emp.user.phone_number}</td>
                                    <td>{emp.branch_name}</td>
                                    <td>
                                        {emp.start_time} - {emp.end_time}
                                    </td>
                                    <td>{emp.user.birth_date}</td>
                                    <td>...</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <button
                        className="prev"
                        onClick={() => setPage(page > 1 ? page - 1 : 1)}
                    >
                        &lt;
                    </button>

                    {Array.from({ length: Math.ceil(count / limit) }, (_, i) => i + 1).map(
                        (num) => (
                            <button
                                key={num}
                                className={num === page ? "active" : ""}
                                onClick={() => setPage(num)}
                            >
                                {num}
                            </button>
                        )
                    )}

                    <button
                        className="next"
                        onClick={() =>
                            setPage(page < Math.ceil(count / limit) ? page + 1 : page)
                        }
                    >
                        &gt;
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Employees;