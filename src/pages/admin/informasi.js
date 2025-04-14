/* eslint-disable react-hooks/exhaustive-deps */
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import Input from "@/components/Input";
import LayoutDashboard from "@/layout/LayoutDashboard";
import { LuDelete, LuInfo, LuLayoutDashboard, LuPen, LuPlus } from "react-icons/lu";
import { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Modal from "@/components/Modal";
import Textarea from "@/components/Textarea";
import Toast from "@/components/Toast";
import { withAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";

const Informasi = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ judul: "", isi: "", url_gambar: "", url_button: "" });
    const [currentItemId, setCurrentItemId] = useState(null);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVisible, setToastVisible] = useState(false);
    const [searchTitle, setSearchTitle] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 20;
    const token = localStorage.getItem("token");
    const getBaseURL = () => process.env.NODE_ENV === "production"
        ? "https://laravel-smmnesia.vercel.app/api/api"
        : "http://localhost:8000/api";

    const showToast = (message) => {
        setToastMessage(message);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${getBaseURL()}/informasi`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.status === "success") setData(result.data);
        } catch (err) {
            console.error("Fetch error:", err);
            showToast("Gagal mengambil data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const filteredData = data.filter(item =>
        item.title.toLowerCase().includes(searchTitle.toLowerCase())
    );
    const currentItems = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const openModal = (modalId, item = null) => {
        setFormData(item ? {
            judul: item.title,
            isi: item.description,
            url_gambar: item.image,
            url_button: item.link || ""
        } : { judul: "", isi: "", url_gambar: "", url_button: "" });

        setCurrentItemId(item?.id || null);
        document.getElementById(modalId)?.showModal();
    };

    const closeModal = (modalId) => document.getElementById(modalId)?.close();
    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const [loadingCreate, setLoadingCreate] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const sendData = async (method, url, modalId, successMsg, body = null, setLoading = null) => {
        if (setLoading) setLoading(true);
        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                ...(body && { body: JSON.stringify(body) })
            });
            const result = await res.json();
            if (result.status === "success") {
                fetchData();
                closeModal(modalId);
                showToast(successMsg);
            }
        } catch (err) {
            console.error(`${method} error:`, err);
            showToast(`Gagal ${successMsg.toLowerCase()}`);
        } finally {
            if (setLoading) setLoading(false);
        }
    };

    const handleCreate = () => sendData("POST", `${getBaseURL()}/informasi`, "create", "Data berhasil ditambahkan", formData, setLoadingCreate);
    const handleUpdate = () => sendData("PUT", `${getBaseURL()}/informasi/${currentItemId}`, "update", "Data berhasil diperbarui", formData, setLoadingUpdate);
    const handleDelete = () => sendData("DELETE", `${getBaseURL()}/informasi/${currentItemId}`, "delete", "Data berhasil dihapus", null, setLoadingDelete);

    return (
        <>
            <LayoutDashboard>
                <Modal id="create" title="CREATE" className="bg-[#DDEBFF]">
                    <div className="space-y-5 mb-4">
                        <Input
                            className="bg-[#5395FF]"
                            label="Judul"
                            name="judul"
                            type="text"
                            placeholder="Judul"
                            value={formData.judul}
                            onChange={handleInputChange}
                        />
                        <Textarea
                            label="Isi"
                            name="isi"
                            className="bg-[#5395FF]"
                            placeholder="Isi"
                            value={formData.isi}
                            onChange={handleInputChange}
                        />
                        <Input
                            className="bg-[#5395FF]"
                            label="URL Gambar"
                            name="url_gambar"
                            type="text"
                            placeholder="URL Gambar"
                            value={formData.url_gambar}
                            onChange={handleInputChange}
                        />
                        <Input
                            className="bg-[#5395FF]"
                            label="URL Tombol"
                            name="url_button"
                            type="text"
                            placeholder="URL Tombol (Opsional)"
                            value={formData.url_button}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex justify-end items-end">
                        <Button
                            bgColor="#5395FF"
                            hoverColor="#DDEBFF"
                            onClick={handleCreate}
                            disabled={loadingCreate}
                        >
                            {loadingCreate ? <Loading className="loading-spinner loading-xs" /> : "SUBMIT"}
                        </Button>
                    </div>
                </Modal>
                <Modal id="update" title="UPDATE" className="bg-[#DDEBFF]">
                    <div className="space-y-5 mb-4">
                        <Input
                            className="bg-[#5395FF]"
                            label="Judul"
                            name="judul"
                            type="text"
                            placeholder="Judul"
                            value={formData.judul}
                            onChange={handleInputChange}
                        />
                        <Textarea
                            label="Isi"
                            name="isi"
                            className="bg-[#5395FF]"
                            placeholder="Isi"
                            value={formData.isi}
                            onChange={handleInputChange}
                        />
                        <Input
                            className="bg-[#5395FF]"
                            label="URL Gambar"
                            name="url_gambar"
                            type="text"
                            placeholder="URL Gambar"
                            value={formData.url_gambar}
                            onChange={handleInputChange}
                        />
                        <Input
                            className="bg-[#5395FF]"
                            label="URL Tombol"
                            name="url_button"
                            type="text"
                            placeholder="URL Tombol (Opsional)"
                            value={formData.url_button}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex justify-end items-end">
                        <Button
                            bgColor="#5395FF"
                            hoverColor="#DDEBFF"
                            onClick={handleUpdate}
                            disabled={loadingUpdate}
                        >
                            {loadingUpdate ? <Loading className="loading-spinner loading-xs" /> : "SUBMIT"}
                        </Button>
                    </div>
                </Modal>
                <Modal id="delete" title="DELETE" className="bg-[#DDEBFF]">
                    <p className="text-sm mb-4">Apakah kamu yakin ingin menghapus data ini?</p>
                    <div className="flex justify-end items-end">
                        <Button
                            bgColor="#5395FF"
                            hoverColor="#DDEBFF"
                            onClick={handleDelete}
                            disabled={loadingDelete}
                        >
                            {loadingDelete ? <Loading className="loading-spinner loading-xs" /> : "SUBMIT"}
                        </Button>
                    </div>
                </Modal>
                <Breadcrumbs
                    items={[
                        {
                            href: "/admin/dashboard",
                            icon: <LuLayoutDashboard />,
                            label: "Dashboard",
                        },
                        {
                            href: "/admin/informasi",
                            icon: <LuInfo />,
                            label: "Informasi",
                        },
                    ]}
                    className="bg-[#5395FF]"
                />
                <div className="grid grid-cols-[1fr_auto] gap-2">
                    <Input
                        className="bg-[#5395FF] w-full"
                        type="text"
                        placeholder="Masukan Judul"
                        value={searchTitle}
                        onChange={(e) => {
                            setSearchTitle(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <Button
                        onClick={() => openModal("create")}
                        bgColor="#5395FF"
                        hoverColor="#DDEBFF"
                        className="btn-square mt-3.5"
                    >
                        <LuPlus />
                    </Button>
                </div>
                <Table className="px-4 py-2 bg-[#5395FF] mt-3.5 mb-4">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>JUDUL</th>
                            <th>DESKRIPSI</th>
                            <th>GAMBAR</th>
                            <th>TAUTAN</th>
                            <th>TANGGAL</th>
                            <th>AKSI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    <Loading className="loading-spinner loading-xs" />
                                </td>
                            </tr>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((item) => (
                                <tr key={item.id} className="hover:bg-base-300 !truncate">
                                    <td>{`#${item.id}`}</td>
                                    <td>{item.title}</td>
                                    <td>{item.description.length > 10 ? `${item.description.slice(0, 10)}...` : item.description}</td>
                                    <td>
                                        <a
                                            href={item.image}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline text-xs"
                                        >
                                            {item.image.length > 10 ? `${item.image.slice(0, 10)}...` : item.image}
                                        </a>
                                    </td>
                                    <td>
                                        {item.link ? (
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline text-xs"
                                            >
                                                {item.link.length > 10 ? `${item.link.slice(0, 10)}...` : item.link}
                                            </a>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td>{item.date}</td>
                                    <td>
                                        <div className="join">
                                            <button
                                                onClick={() => openModal("update", item)}
                                                className="btn btn-xs btn-square join-item border-2 border-black bg-[#DDEBFF]"
                                            >
                                                <LuPen />
                                            </button>
                                            <button
                                                onClick={() => openModal("delete", item)}
                                                className="btn btn-xs btn-square join-item border-2 border-black bg-[#DDEBFF]"
                                            >
                                                <LuDelete />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center text-xs">
                                    Data tidak ditemukan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                {/* Pagination */}
                <div className="flex justify-center mt-6">
                    <Pagination
                        totalItems={filteredData.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>

                <Toast
                    toastClassName="toast-bottom toast-end"
                    alertClassName="bg-base-200"
                    isVisible={toastVisible}
                >
                    {toastMessage}
                </Toast>
            </LayoutDashboard>
        </>
    );
};

export default withAuth(Informasi);