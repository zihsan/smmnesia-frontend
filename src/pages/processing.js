/* eslint-disable react-hooks/exhaustive-deps */
import Layout from "@/layout/Layout";
import { LuCircleArrowUp, LuHouse, LuInfo } from "react-icons/lu";
import Breadcrumbs from "@/components/Breadcrumbs";
import Pagination from "@/components/Pagination";
import Alert from "@/components/Alert";
import Table from "@/components/Table";
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";

const Processing = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const getBaseURL = () =>
        process.env.NODE_ENV === "production"
            ? "https://laravel-smmnesia.vercel.app/api/api"
            : "http://localhost:8000/api";

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${getBaseURL()}/orders/processing`);
            const result = await response.json();

            if (result.status === 'success') {
                setData(result.data);
            } else {
                console.error('Gagal mengambil data');
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat memuat data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <Layout>
            <Breadcrumbs
                items={[
                    {
                        href: "/",
                        icon: <LuHouse />,
                        label: "Home",
                    },
                    {
                        href: "/Processing",
                        icon: <LuCircleArrowUp />,
                        label: "Processing",
                    },
                ]}
                className="mt-4 sm:mt-8 bg-[#5395FF] mb-4"
            />
            <Alert
                icon={<LuInfo />}
                message="Pesanan Anda sedang diproses oleh tim kami. Estimasi waktu penyelesaiannya dalam waktu 72 jam"
                bgColor="#5395FF"
            />
            <Table className="px-4 py-2 bg-[#5395FF] mt-3.5 mb-4">
                <thead>
                    <tr>
                        <th>ORDER ID</th>
                        <th>LAYANAN</th>
                        <th>DATE STARTED</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="4" className="text-center">
                                <Loading className="loading-spinner loading-xs" />
                            </td>
                        </tr>
                    ) : currentItems.length > 0 ? (
                        currentItems.map((item) => (
                            <tr key={item.id} className="hover:bg-base-300 !truncate">
                                <td>{`#${item.oid}`}</td>
                                <td>{item.layanan}</td>
                                <td>
                                    {new Date(item.update_at).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                </td>
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
                    totalItems={data.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </Layout>
    );
};

export default Processing;