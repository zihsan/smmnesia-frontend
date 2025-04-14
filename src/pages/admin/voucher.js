/* eslint-disable react-hooks/exhaustive-deps */
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import Input from "@/components/Input";
import LayoutDashboard from "@/layout/LayoutDashboard";
import { LuCirclePlus, LuDelete, LuLayoutDashboard, LuPen, LuPlus, LuTicket } from "react-icons/lu";
import { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import Toast from "@/components/Toast";
import { withAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";

const Voucher = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVisible, setToastVisible] = useState(false);
    const [searchCode, setSearchCode] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [formData, setFormData] = useState({ voucher: '', is_used: 0 });

    const itemsPerPage = 20;
    const getBaseURL = () =>
        process.env.NODE_ENV === 'production'
            ? 'https://laravel-smmnesia.vercel.app/api/api'
            : 'http://localhost:8000/api';

    const getToken = () => localStorage.getItem('token');

    const showToast = (msg) => {
        setToastMessage(msg);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
    };

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${getBaseURL()}/vouchers`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const result = await res.json();
            result.success ? setData(result.data) : showToast('Failed to fetch vouchers');
        } catch (err) {
            console.error(err);
            showToast('Error fetching vouchers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchVouchers(); }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const [bulkCount, setBulkCount] = useState('');
    const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);

    const createBulkVouchers = async () => {
        setIsBulkSubmitting(true);
        try {
            const res = await fetch(`${getBaseURL()}/vouchers/bulk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ jumlah: parseInt(bulkCount) }),
            });

            const result = await res.json();
            if (result.success) {
                showToast(`${bulkCount} voucher berhasil dibuat`);
                fetchVouchers();
                closeModal('create2');
                setBulkCount('');
            } else {
                showToast(result.message || 'Gagal membuat voucher massal');
            }
        } catch (err) {
            console.error(err);
            showToast('Error membuat voucher massal');
        } finally {
            setIsBulkSubmitting(false);
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const createVoucher = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`${getBaseURL()}/vouchers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ voucher: formData.voucher }),
            });

            const result = await res.json();
            if (result.success) {
                showToast('Voucher created successfully');
                fetchVouchers();
                closeModal('create');
                setFormData({ voucher: '', is_used: 0 });
            } else {
                showToast(result.message || 'Failed to create voucher');
            }
        } catch (err) {
            console.error(err);
            showToast('Error creating voucher');
        } finally {
            setIsSubmitting(false);
        }
    };

    const [isUpdating, setIsUpdating] = useState(false);

    const updateVoucher = async () => {
        setIsUpdating(true);
        try {
            const res = await fetch(`${getBaseURL()}/vouchers/${selectedVoucher.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    voucher: formData.voucher,
                    is_used: formData.is_used === 'TERSEDIA' ? 0 : 1,
                }),
            });

            const result = await res.json();
            if (result.success) {
                showToast('Voucher updated successfully');
                fetchVouchers();
                closeModal('update');
            } else {
                showToast(result.message || 'Failed to update voucher');
            }
        } catch (err) {
            console.error(err);
            showToast('Error updating voucher');
        } finally {
            setIsUpdating(false);
        }
    };

    const [isDeleting, setIsDeleting] = useState(false);

    const deleteVoucher = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`${getBaseURL()}/vouchers/${selectedVoucher.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            });

            const result = await res.json();
            if (result.success) {
                showToast('Voucher deleted successfully');
                fetchVouchers();
                closeModal('delete');
            } else {
                showToast(result.message || 'Failed to delete voucher');
            }
        } catch (err) {
            console.error(err);
            showToast('Error deleting voucher');
        } finally {
            setIsDeleting(false);
        }
    };

    const openModal = (id, voucher = null) => {
        if (voucher) {
            setSelectedVoucher(voucher);
            setFormData({
                voucher: voucher.voucher,
                is_used: voucher.is_used === 0 ? 'TERSEDIA' : 'TIDAK TERSEDIA',
            });
        } else {
            setFormData({ voucher: '', is_used: 0 });
        }
        document.getElementById(id)?.showModal();
    };

    const closeModal = (id) => {
        document.getElementById(id)?.close();
        setSelectedVoucher(null);
        setFormData({ voucher: '', is_used: 0 });
    };

    const filteredData = data.filter((item) =>
        item.voucher.toLowerCase().includes(searchCode.toLowerCase())
    );

    const currentItems = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            <LayoutDashboard>
                <Modal id="create2" title="CREATE" className="bg-[#DDEBFF]">
                    <div className="space-y-5 mb-4">
                        <Input
                            className="bg-[#5395FF]"
                            label="Tambah Voucher (Massal)"
                            type="number"
                            placeholder="Jumlah"
                            value={bulkCount}
                            onChange={(e) => setBulkCount(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end items-end">
                        <Button
                            bgColor="#5395FF"
                            hoverColor="#DDEBFF"
                            onClick={createBulkVouchers}
                            disabled={isBulkSubmitting}
                        >
                            {isBulkSubmitting ? <Loading className="loading-spinner loading-xs" /> : 'SUBMIT'}
                        </Button>
                    </div>
                </Modal>
                <Modal id="create" title="CREATE" className="bg-[#DDEBFF]">
                    <div className="space-y-5 mb-4">
                        <Input
                            className="bg-[#5395FF]"
                            label="Tambah Voucher"
                            type="text"
                            name="voucher"
                            placeholder="Code"
                            value={formData.voucher}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex justify-end items-end gap-2">
                        <Button
                            bgColor="#5395FF"
                            hoverColor="#DDEBFF"
                            onClick={createVoucher}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Loading className="loading-spinner loading-xs" /> : 'SUBMIT'}
                        </Button>
                    </div>
                </Modal>
                <Modal id="update" title="UPDATE" className="bg-[#DDEBFF]">
                    <div className="space-y-5 mb-4">
                        <Input
                            className="bg-[#5395FF]"
                            label="Edit Voucher"
                            type="text"
                            name="voucher"
                            placeholder="Code"
                            value={formData.voucher}
                            onChange={handleInputChange}
                        />
                        <Select
                            className="bg-[#5395FF]"
                            label="Status"
                            name="is_used"
                            placeholder="Pilih Status"
                            options={['TIDAK TERSEDIA', 'TERSEDIA']}
                            value={formData.is_used}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex justify-end items-end gap-2">
                        <Button
                            bgColor="#5395FF"
                            hoverColor="#DDEBFF"
                            onClick={updateVoucher}
                            disabled={isUpdating}
                        >
                            {isUpdating ? <Loading className="loading-spinner loading-xs" /> : 'SUBMIT'}
                        </Button>
                    </div>
                </Modal>
                <Modal id="delete" title="DELETE" className="bg-[#DDEBFF]">
                    <p className="text-sm mb-4">Apakah kamu yakin ingin menghapus voucher ini?</p>
                    <div className="flex justify-end items-end gap-2">
                        <Button
                            bgColor="#5395FF"
                            hoverColor="#DDEBFF"
                            onClick={deleteVoucher}
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loading className="loading-spinner loading-xs" /> : 'SUBMIT'}
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
                            href: "/admin/voucher",
                            icon: <LuTicket />,
                            label: "Voucher",
                        },
                    ]}
                    className="bg-[#5395FF]"
                />
                <div className="grid grid-cols-[1fr_auto_auto] gap-2 items-center">
                    <Input
                        className="bg-[#5395FF] w-full"
                        type="text"
                        placeholder="Masukan Code"
                        value={searchCode}
                        onChange={(e) => {
                            setSearchCode(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <Button
                        bgColor="#5395FF"
                        hoverColor="#DDEBFF"
                        onClick={() => openModal('create')}
                        className="btn-square mt-3"
                    >
                        <LuPlus />
                    </Button>
                    <Button onClick={() => openModal('create2')}
                        bgColor="#5395FF"
                        hoverColor="#DDEBFF"
                        className="btn-square mt-3"
                    >
                        <LuCirclePlus />
                    </Button>
                </div>
                <Table className="px-4 py-2 bg-[#5395FF] mt-3.5 mb-4">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>CODE</th>
                            <th>STATUS</th>
                            <th>AKSI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="text-xs text-center"><Loading className="loading-spinner loading-xs" /> </td>
                            </tr>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((item) => (
                                <tr key={item.id} className="hover:bg-base-300 !truncate">
                                    <td>{`#${item.id}`}</td>
                                    <td>{item.voucher}</td>
                                    <td className="uppercase">{item.is_used === 0 ? 'TERSEDIA' : 'TIDAK TERSEDIA'}</td>
                                    <td>
                                        <div className="join">
                                            <button onClick={() => openModal('update', item)} className="btn btn-xs btn-square join-item border-2 border-black bg-[#DDEBFF]">
                                                <LuPen />
                                            </button>
                                            <button onClick={() => openModal('delete', item)} className="btn btn-xs btn-square join-item border-2 border-black bg-[#DDEBFF]">
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

export default withAuth(Voucher);