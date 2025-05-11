import { useEffect, useState } from "react";
import "../../styles/clients.scss";
import axios from "axios";
import Header from "../Header/header";
import Footer from "../Footer/footer";
import LeftPage from "../LeftPage/leftpage";

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
}

const Checkbox = ({
    checked,
    onCheckedChange,
}: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}) => {
    return (
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            className="checkbox-input"
        />
    );
};

const Avatar = ({
    src,
    alt,
    name,
}: {
    src: string | null;
    alt: string;
    name: string;
}) => {
    const fallbackImage = "/icons/10.svg";
    return (
        <div className="avatar">
            <img
                style={{ borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer" }}
                src={src || fallbackImage}
                alt={alt}
                className="avatar-image"
            />
        </div>
    );
};

const Clients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [filteredClients, setFilteredClients] = useState<Client[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedClients, setSelectedClients] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [branchIdFilter, setBranchIdFilter] = useState<number | null>(null);
    const pageSize = 10;

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get("https://api.noventer.uz/api/v1/company/clients/");
                setClients(response.data.results);
            } catch (error) {
                console.error("Error fetching clients:", error);
                const mockClients: Client[] = Array(30).fill(null).map((_, index) => ({
                    id: index + 1,
                    branch: index % 3,
                    branch_name: ["Head Office", "Branch A", "Branch B"][index % 3],
                    name: `Carry Anna ${index + 1}`,
                    phone: "+998 (93) 954-21-11",
                    avatar: `https://i.pravatar.cc/100?img=${index + 10}`,
                    license_file: null,
                    created_at: "2025-02-01T08:56:00",
                    updated_at: "2025-02-01T08:56:00",
                }));
                setClients(mockClients);
            }
        };

        fetchClients();
    }, []);

    useEffect(() => {
        let result = clients;

        if (searchQuery) {
            result = result.filter((client) =>
                client.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (branchIdFilter !== null) {
            result = result.filter((client) => client.branch === branchIdFilter);
        }

        setFilteredClients(result);
        setCurrentPage(1);
    }, [searchQuery, branchIdFilter, clients]);

    const paginatedClients = filteredClients.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const totalPages = Math.ceil(filteredClients.length / pageSize);

    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked);
        setSelectedClients(checked ? paginatedClients.map((client) => client.id) : []);
    };

    const handleSelectClient = (clientId: number) => {
        setSelectedClients((prev) =>
            prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getFullYear()} ${date
                .getHours()
                .toString()
                .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    };

    return (
        <div className="clients-container">
            <Header />
            <LeftPage />

            <div className="newinput">
                <div className="input">
                    <form className="from">
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="select">
                            <select onChange={(e) => setBranchIdFilter(e.target.value === "all" ? null : parseInt(e.target.value))}>
                                <option value="all">Barcha filiallar</option>
                                {[...new Set(clients.map((c) => c.branch))].map((branchId) => (
                                    <option key={branchId} value={branchId ?? 0}>
                                        {clients.find((c) => c.branch === branchId)?.branch_name || `Filial ${branchId}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </form>
                    <div className="add-btn">
                        <button>+ Mijoz qo'shish</button>
                    </div>
                </div>
            </div>

            <div className="clients-table">
                <table>
                    <thead>
                        <tr>
                            <th className="checkbox-column">
                                <Checkbox
                                    checked={selectAll}
                                    onCheckedChange={(checked: any) => handleSelectAll(!!checked)}
                                />
                            </th>
                            <th>F.I.SH</th>
                            <th>MOBILE NUMBER</th>
                            <th>CITY</th>
                            <th>FILIAL NOMI</th>
                            <th>LITSENZIYA</th>
                            <th>YARATILGAN VAQTI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedClients.map((client) => (
                            <tr key={client.id}>
                                <td className="checkbox-column">
                                    <Checkbox
                                        checked={selectedClients.includes(client.id)}
                                        onCheckedChange={() => handleSelectClient(client.id)}
                                    />
                                </td>
                                <td className="name-column">
                                    <div className="user-info">
                                        <Avatar src={client.avatar} alt={client.name} name={client.name} />
                                        <span>{client.name}</span>
                                    </div>
                                </td>
                                <td>{client.phone}</td>
                                <td>Tashkent</td>
                                <td>{client.branch_name}</td>
                                <td className="license-column">
                                    <span>Yuklab olish</span>
                                </td>
                                <td className="date-column">{formatDate(client.created_at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="with">
                    <div className="with-text">
                        <p>1 to 10 Items of 15 <span>View all {">"} </span></p>
                    </div>

                    <div className="client-pagination">
                        <button
                            className="pagination-btn prev-btn"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                            <button
                                key={num}
                                className={`pagination-btn ${num === currentPage ? "active-page" : ""}`}
                                onClick={() => setCurrentPage(num)}
                            >
                                {num}
                            </button>
                        ))}
                        <button
                            className="pagination-btn next-btn"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default Clients;
