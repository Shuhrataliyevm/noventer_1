import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/employees.scss";

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

    return (
        <div className="employees">
            <h2>Xodimlar ro'yxati</h2>
            <div className="filters">
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

                <input
                    type="text"
                    placeholder="Ism bo'yicha qidirish"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <table className="employees-table">
                <thead>
                    <tr>
                        <th>Ism</th>
                        <th>Tel</th>
                        <th>Passport</th>
                        <th>Lavozim</th>
                        <th>Ish vaqti</th>
                        <th>Maosh</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((emp) => (
                        <tr key={emp.id}>
                            <td>{emp.user.full_name}</td>
                            <td>{emp.user.phone_number}</td>
                            <td>{emp.user.passport_number}</td>
                            <td>{emp.position}</td>
                            <td>
                                {emp.start_time} - {emp.end_time}
                            </td>
                            <td>{emp.salary} so'm</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
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
            </div>
        </div>
    );
};

export default Employees;
