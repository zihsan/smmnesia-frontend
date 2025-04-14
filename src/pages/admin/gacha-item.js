/* eslint-disable react-hooks/exhaustive-deps */
import Breadcrumbs from "@/components/Breadcrumbs";
import LayoutDashboard from "@/layout/LayoutDashboard";
import { LuDelete, LuDice6, LuLayoutDashboard, LuPen, LuPlus } from "react-icons/lu";
import { useState, useEffect } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Modal from "@/components/Modal";
import Toast from "@/components/Toast";
import { withAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";

const GachaItem = () => {
    const [toastMessage, setToastMessage] = useState('');
    const [toastVisible, setToastVisible] = useState(false);
    const [searchNama, setSearchNama] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({ id: null, name: '', rate: '', image: '' });
    const itemsPerPage = 10;

    const getBaseURL = () =>
        process.env.NODE_ENV === 'production'
            ? 'https://laravel-smmnesia.vercel.app/api/api'
            : 'http://localhost:8000/api';

    const showToast = (message) => {
        setToastMessage(message);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
    };

    const fetchGachaItems = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${getBaseURL()}/gacha-items`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            const result = await res.json();
            if (!result.success) throw new Error(result.message || 'Gagal mengambil data');
            setData(result.data);
        } catch (err) {
            setError(err.message);
            showToast(err.message || 'Gagal mengambil data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGachaItems();
    }, []);

    const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchNama.toLowerCase())
    );
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const openModal = (modalId, item = null) => {
        setFormData(item || { id: null, name: '', rate: '', image: '' });
        document.getElementById(modalId)?.showModal();
    };

    const closeModal = (modalId) => {
        document.getElementById(modalId)?.close();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Unified submit handler for create and update
    const handleSubmit = async (e, type) => {
        e.preventDefault();
        setIsSubmitting(true);

        const method = type === 'create' ? 'POST' : 'PUT';
        const url =
            type === 'create'
                ? `${getBaseURL()}/gacha-items`
                : `${getBaseURL()}/gacha-items/${formData.id}`;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    rate: parseFloat(formData.rate),
                    image: formData.image,
                }),
            });

            const result = await res.json();
            if (!result.success) throw new Error(result.message || 'Gagal menyimpan data');

            await fetchGachaItems();
            showToast(`Gacha item berhasil ${type === 'create' ? 'dibuat' : 'diperbarui'}`);
            closeModal(type);
        } catch (err) {
            showToast(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`${getBaseURL()}/gacha-items/${formData.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            const result = await res.json();
            if (!result.success) throw new Error(result.message);

            await fetchGachaItems();
            showToast('Gacha item berhasil dihapus');
            closeModal('delete');
        } catch (err) {
            showToast(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <LayoutDashboard>
                <Modal id="create" title="CREATE" className="bg-[#DDEBFF]">
                    <form onSubmit={(e) => handleSubmit(e, 'create')}>
                        <div className="space-y-5 mb-4">
                            <Input
                                className="bg-[#5395FF]"
                                label="Nama"
                                name="name"
                                type="text"
                                placeholder="Nama"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                className="bg-[#5395FF]"
                                label="Rate"
                                name="rate"
                                type="number"
                                placeholder="Rate"
                                value={formData.rate}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                className="bg-[#5395FF]"
                                label="URL Gambar"
                                name="image"
                                type="text"
                                placeholder="URL Gambar"
                                value={formData.image}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="flex justify-end items-end">
                            <Button
                                type="submit"
                                bgColor="#5395FF"
                                hoverColor="#DDEBFF"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loading className="loading-spinner loading-xs" />
                                ) : (
                                    "SUBMIT"
                                )}
                            </Button>
                        </div>
                    </form>
                </Modal>
                <Modal id="update" title="UPDATE" className="bg-[#DDEBFF]">
                    <form onSubmit={(e) => handleSubmit(e, 'update')}>
                        <div className="space-y-5 mb-4">
                            <Input
                                className="bg-[#5395FF]"
                                label="Nama"
                                name="name"
                                type="text"
                                placeholder="Nama"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                className="bg-[#5395FF]"
                                label="Rate"
                                name="rate"
                                type="number"
                                placeholder="Rate"
                                value={formData.rate}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                className="bg-[#5395FF]"
                                label="URL Gambar"
                                name="image"
                                type="text"
                                placeholder="URL Gambar"
                                value={formData.image}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="flex justify-end items-end">
                            <Button
                                type="submit"
                                bgColor="#5395FF"
                                hoverColor="#DDEBFF"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loading className="loading-spinner loading-xs" />
                                ) : (
                                    "SUBMIT"
                                )}
                            </Button>
                        </div>
                    </form>
                </Modal>
                <Modal id="delete" title="DELETE" className="bg-[#DDEBFF]">
                    <p className="text-sm mb-4">Apakah kamu yakin ingin menghapus data ini?</p>
                    <div className="flex justify-end items-end">
                        <Button
                            onClick={handleDelete}
                            bgColor="#5395FF"
                            hoverColor="#DDEBFF"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Loading className="loading-spinner loading-xs" /> : 'SUBMIT'}
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
                            href: "/admin/gacha-item",
                            icon: <LuDice6 />,
                            label: "Gacha Item",
                        },
                    ]}
                    className="bg-[#5395FF]"
                />
                <div className="grid grid-cols-[1fr_auto] gap-2">
                    <Input
                        className="bg-[#5395FF] w-full"
                        type="text"
                        placeholder="Masukan Nama"
                        value={searchNama}
                        onChange={(e) => {
                            setSearchNama(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <Button
                        onClick={() => openModal('create')}
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
                            <th>NAMA</th>
                            <th>RATE</th>
                            <th>IMAGE</th>
                            <th>AKSI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    <Loading className="loading-spinner loading-xs" />
                                </td>
                            </tr>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((item) => (
                                <tr key={item.id} className="hover:bg-base-300 !truncate">
                                    <td>{`#${item.id}`}</td>
                                    <td>{item.name}</td>
                                    <td>{item.rate}</td>
                                    <td>{item.image.length > 10 ? `${item.image.slice(0, 10)}...` : item.image}</td>
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
                                <td colSpan="5" className="text-center text-xs">
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

export default withAuth(GachaItem);