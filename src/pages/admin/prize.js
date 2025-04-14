/* eslint-disable react-hooks/exhaustive-deps */
import Breadcrumbs from "@/components/Breadcrumbs";
import Input from "@/components/Input";
import LayoutDashboard from "@/layout/LayoutDashboard";
import { LuGift, LuLayoutDashboard } from "react-icons/lu";
import { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { withAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";

const Prize = () => {
    const [gachaData, setGachaData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchCode, setSearchCode] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 20;

    const getBaseURL = () =>
        process.env.NODE_ENV === "production"
            ? "https://laravel-smmnesia.vercel.app/api/api"
            : "http://localhost:8000/api";

    const fetchGacha = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${getBaseURL()}/gacha`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const result = await res.json();

            if (!result.success) throw new Error(result.message || "Gagal mengambil data gacha");

            setGachaData(result.data);
            console.log("Data fetched:", result.data);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGacha();
    }, []);

    const filteredData = gachaData.filter((item) =>
        item.voucher?.toLowerCase().includes(searchCode.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <LayoutDashboard>
                <Breadcrumbs
                    items={[
                        {
                            href: "/admin/dashboard",
                            icon: <LuLayoutDashboard />,
                            label: "Dashboard",
                        },
                        {
                            href: "/admin/prize",
                            icon: <LuGift />,
                            label: "Prize",
                        },
                    ]}
                    className="bg-[#5395FF]"
                />
                <Input
                    className="bg-[#5395FF]"
                    type="text"
                    placeholder="Masukan Code"
                    value={searchCode}
                    onChange={(e) => {
                        setSearchCode(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                <Table className="px-4 py-2 bg-[#5395FF] mt-3.5 mb-4">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>CODE</th>
                            <th>PRIZE</th>
                            <th>DATE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="4" className="text-center text-xs">
                                    <Loading className="loading-spinner loading-xs" />
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="4" className="text-center text-xs text-red-500">
                                    {error}
                                </td>
                            </tr>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((item) => (
                                <tr key={item.id} className="hover:bg-base-300 !truncate">
                                    <td>{`#${item.id}`}</td>
                                    <td>{item.voucher}</td>
                                    <td>{item.name}</td>
                                    <td>{item.create_at}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center text-xs">
                                    Data tidak ditemukan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <div className="flex justify-center mt-6">
                    <Pagination
                        totalItems={filteredData.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </LayoutDashboard>
        </>
    );
};

export default withAuth(Prize);