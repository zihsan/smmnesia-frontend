/* eslint-disable react-hooks/exhaustive-deps */
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import LayoutDashboard from "@/layout/LayoutDashboard";
import { LuDelete, LuLayoutDashboard, LuListOrdered, LuPen, LuPlus } from "react-icons/lu";
import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import Toast from "@/components/Toast";
import { withAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";

const Kategori = () => {
    const [toastMessage, setToastMessage] = useState('');
    const [toastVisible, setToastVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchCode, setSearchCode] = useState('');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ id: null, code: '', name: '' });

    const itemsPerPage = 20;

    const getBaseURL = () =>
        process.env.NODE_ENV === 'production'
            ? 'https://laravel-smmnesia.vercel.app/api/api'
            : 'http://localhost:8000/api';

    const getToken = () => localStorage.getItem('token');

    const showToast = (message) => {
        setToastMessage(message);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
    };

    const fetchKategori = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`${getBaseURL()}/kategori`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    Accept: 'application/json',
                },
            });
            const result = await res.json();
            if (!result.success) throw new Error(result.message || 'Gagal mengambil data kategori');
            setData(result.data);
        } catch (err) {
            setError(err.message);
            showToast('Gagal mengambil data kategori');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchKategori();
    }, []);

    const filteredData = data.filter(item =>
        item.code.toLowerCase().includes(searchCode.toLowerCase())
    );

    const currentItems = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const openModal = (modalId, item = null) => {
        setFormData(item ? { id: item.id, code: item.code, name: item.name } : { id: null, code: '', name: '' });
        document.getElementById(modalId)?.showModal();
    };

    const closeModal = (modalId) => {
        document.getElementById(modalId)?.close();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e, type) => {
        e.preventDefault();
        setIsSubmitting(true);

        const method = type === 'create' ? 'POST' : 'PUT';
        const url = `${getBaseURL()}/kategori${type === 'create' ? '' : `/${formData.id}`}`;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: formData.code, name: formData.name }),
            });
            const result = await res.json();

            if (!result.success) throw new Error(result.message || 'Gagal menyimpan data');

            await fetchKategori();
            showToast(`Kategori berhasil ${type === 'create' ? 'dibuat' : 'diperbarui'}`);
            closeModal(type);
        } catch (err) {
            showToast(err.message || 'Gagal menyimpan data');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);

        try {
            const res = await fetch(`${getBaseURL()}/kategori/${formData.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await res.json();
            if (!result.success) throw new Error(result.message || 'Gagal menghapus kategori');

            await fetchKategori();
            showToast('Kategori berhasil dihapus');
            closeModal('delete');
        } catch (err) {
            showToast(err.message || 'Gagal menghapus kategori');
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
                                label="Code"
                                name="code"
                                type="text"
                                placeholder="Code"
                                value={formData.code}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                className="bg-[#5395FF]"
                                label="Kategori"
                                name="name"
                                type="text"
                                placeholder="Kategori"
                                value={formData.name}
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
                                label="Code"
                                name="code"
                                type="text"
                                placeholder="Code"
                                value={formData.code}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                className="bg-[#5395FF]"
                                label="Kategori"
                                name="name"
                                type="text"
                                placeholder="Kategori"
                                value={formData.name}
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
                            {isSubmitting ? (
                                <Loading className="loading-spinner loading-xs" />
                            ) : (
                                "SUBMIT"
                            )}
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
                            href: "/admin/kategori",
                            icon: <LuListOrdered />,
                            label: "Kategori",
                        },
                    ]}
                    className="bg-[#5395FF]"
                />
                <div className="grid grid-cols-[1fr_auto] gap-2">
                    <Input
                        className="bg-[#5395FF] w-full"
                        type="text"
                        placeholder="Masukan Code"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
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
                            <th>CODE</th>
                            <th>NAME</th>
                            <th>AKSI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="4" className="text-center text-xs">
                                    <Loading className="loading-spinner loading-xs" />
                                </td>
                            </tr>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((item) => (
                                <tr key={item.id} className="hover:bg-base-300 !truncate">
                                    <td>{`#${item.id}`}</td>
                                    <td>{item.code}</td>
                                    <td>{item.name}</td>
                                    <td>
                                        <div className="join">
                                            <button
                                                onClick={() => openModal('update', item)}
                                                className="btn btn-xs btn-square join-item border-2 border-black bg-[#DDEBFF]"
                                            >
                                                <LuPen />
                                            </button>
                                            <button
                                                onClick={() => openModal('delete', item)}
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

export default withAuth(Kategori);