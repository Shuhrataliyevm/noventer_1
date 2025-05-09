import { useEffect, useState } from "react";
import { Pagination } from "antd";
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

const Checkbox = ({ checked, onCheckedChange }: { checked: boolean, onCheckedChange: (checked: boolean) => void }) => {
    return (
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            className="checkbox-input"
        />
    );
};

const Avatar = ({ src, alt }: { src: string | null, alt: string, name: string }) => {
    const fallbackImage = "/icons/10.svg";
    return (
        <div className="avatar">
            <img style={{ borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer" }}
                src={src || fallbackImage}
                alt={alt}
                className="avatar-image"
            />
        </div>
    );
};

const Clients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedClients, setSelectedClients] = useState<number[]>([]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get(
                    `https://api.noventer.uz/api/v1/company/clients/?page=${currentPage}`
                );
                setClients(response.data.results);
                setTotalPages(response.data.total_pages);
            } catch (error) {
                console.error('Error fetching clients:', error);
                const mockClients: Client[] = Array(10).fill(null).map((_, index) => ({
                    id: index + 1,
                    branch: 1,
                    branch_name: "Head Office",
                    name: "Carry Anna",
                    phone: "+998 (93) 954-21-11",
                    avatar: `https://i.pravatar.cc/100?img=${index + 10}`,
                    license_file: null,
                    created_at: "2025-02-01T08:56:00",
                    updated_at: "2025-02-01T08:56:00"
                }));
                setClients(mockClients);
            }
        };

        fetchClients();
    }, [currentPage]);

    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked);
        setSelectedClients(checked ? clients.map(client => client.id) : []);
    };

    const handleSelectClient = (clientId: number) => {
        setSelectedClients(prev =>
            prev.includes(clientId)
                ? prev.filter(id => id !== clientId)
                : [...prev, clientId]
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const onPaginationChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="clients-container">
            <Header />
            <LeftPage />

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
                        {clients.map((client) => (
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
            </div>
            <Footer />
        </div>
    );
};

export default Clients;
