/* eslint-disable react-hooks/exhaustive-deps */
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import Input from "@/components/Input";
import LayoutDashboard from "@/layout/LayoutDashboard";
import { LuCreditCard, LuDelete, LuLayoutDashboard, LuPen, LuPlus } from "react-icons/lu";
import { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import Toast from "@/components/Toast";
import { withAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";

const Metode = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVisible, setToastVisible] = useState(false);
    const [searchCode, setSearchCode] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [formData, setFormData] = useState({
        s_id: '', name: '', rekening: '', min: '', type: '', status: ''
    });
    const itemsPerPage = 10;

    const getBaseURL = () =>
        process.env.NODE_ENV === "production"
            ? "https://laravel-smmnesia.vercel.app/api/api"
            : "http://localhost:8000/api";

    const getToken = () => localStorage.getItem("token");

    const showToast = (msg) => {
        setToastMessage(msg);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
    };

    const fetchPaymentMethods = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${getBaseURL()}/payment-methods`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            const result = await res.json();
            result.success ? setData(result.data) : showToast('Failed to fetch payment methods');
        } catch (err) {
            console.error(err);
            showToast('Error fetching payment methods');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPaymentMethods(); }, []);

    const handleInputChange = ({ target: { name, value } }) =>
        setFormData(prev => ({ ...prev, [name]: value }));

    const resetForm = () => setFormData({
        s_id: '', name: '', rekening: '', min: '', type: '', status: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const createPaymentMethod = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`${getBaseURL()}/payment-methods`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(formData)
            });
            const result = await res.json();
            if (result.success) {
                showToast('Payment method created successfully');
                fetchPaymentMethods();
                closeModal('create');
                resetForm();
            } else {
                showToast(result.message || 'Failed to create payment method');
            }
        } catch (err) {
            console.error(err);
            showToast('Error creating payment method');
        } finally {
            setIsSubmitting(false);
        }
    };

    const updatePaymentMethod = async () => {
        setIsUpdating(true);
        try {
            const res = await fetch(`${getBaseURL()}/payment-methods/${selectedPaymentMethod.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(formData)
            });
            const result = await res.json();
            if (result.success) {
                showToast('Payment method updated successfully');
                fetchPaymentMethods();
                closeModal('update');
            } else {
                showToast(result.message || 'Failed to update payment method');
            }
        } catch (err) {
            console.error(err);
            showToast('Error updating payment method');
        } finally {
            setIsUpdating(false);
        }
    };

    const deletePaymentMethod = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`${getBaseURL()}/payment-methods/${selectedPaymentMethod.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            const result = await res.json();
            if (result.success) {
                showToast('Payment method deleted successfully');
                fetchPaymentMethods();
                closeModal('delete');
            } else {
                showToast(result.message || 'Failed to delete payment method');
            }
        } catch (err) {
            console.error(err);
            showToast('Error deleting payment method');
        } finally {
            setIsDeleting(false);
        }
    };

    const openModal = (id, method = null) => {
        if (method) {
            setSelectedPaymentMethod(method);
            setFormData({
                s_id: method.s_id,
                name: method.name,
                rekening: method.rekening || '',
                min: method.min,
                type: method.type,
                status: method.status
            });
        } else {
            resetForm();
        }
        document.getElementById(id)?.showModal();
    };

    const closeModal = (id) => {
        document.getElementById(id)?.close();
        setSelectedPaymentMethod(null);
        resetForm();
    };

    const filteredData = data.filter(item =>
        item.s_id.toLowerCase().includes(searchCode.toLowerCase())
    );

    const currentItems = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            <LayoutDashboard>
                <Modal id="create" title="CREATE" className="bg-[#DDEBFF]">
                    <div className="space-y-5 mb-4">
                        <Input
                            className="bg-[#5395FF]"
                            label="Payment Code"
                            type="text"
                            name="s_id"
                            placeholder="Payment Code"
                            value={formData.s_id}
                            onChange={handleInputChange}
                        />
                        <Input
                            className="bg-[#5395FF]"
                            label="Nama Metode"
                            type="text"
                            name="name"
                            placeholder="Nama Metode"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        <Input
                            className="bg-[#5395FF]"
                            label="Rekening"
                            type="text"
                            name="rekening"
                            placeholder="Rekening (Optional)"
                            value={formData.rekening}
                            onChange={handleInputChange}
                        />
                        <Input
                            className="bg-[#5395FF]"
                            label="Minimal"
                            type="text"
                            name="min"
                            placeholder="Minimal"
                            value={formData.min}
                            onChange={handleInputChange}
                        />
                        <Select
                            className="bg-[#5395FF] uppercase"
                            label="Type"
                            name="type"
                            placeholder="Pilih Type"
                            options={['otomatis', 'manual']}
                            value={formData.type}
                            onChange={handleInputChange}
                        />
                        <Select
                            className="bg-[#5395FF]"
                            label="Status"
                            name="status"
                            placeholder="Pilih Status"
                            options={[
                                { label: 'AKTIF', value: '1' },
                                { label: 'NON AKTIF', value: '2' },
                            ]}
                            value={formData.status}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex justify-end items-end gap-2">
                        <Button
                            bgColor="#5395FF"
                            hoverColor="#DDEBFF"
                            onClick={createPaymentMethod}
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
                            label="Payment Code"
                            type="text"
                            name="s_id"
                            placeholder="Payment Code"
                            value={formData.s_id}
                            onChange={handleInputChange}
                        />
                        <Input
                            className="bg-[#5395FF]"
                            label="Nama Metode"
                            type="text"
                            name="name"
                            placeholder="Nama Metode"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        <Input
                            className="bg-[#5395FF]"
                            label="Rekening"
                            type="text"
                            name="rekening"
                            placeholder="Rekening (Optional)"
                            value={formData.rekening}
                            onChange={handleInputChange}
                        />
                        <Input
                            className="bg-[#5395FF]"
                            label="Minimal"
                            type="text"
                            name="min"
                            placeholder="Minimal"
                            value={formData.min}
                            onChange={handleInputChange}
                        />
                        <Select
                            className="bg-[#5395FF] uppercase"
                            label="Type"
                            name="type"
                            placeholder="Pilih Type"
                            options={['otomatis', 'manual']}
                            value={formData.type}
                            onChange={handleInputChange}
                        />
                        <Select
                            className="bg-[#5395FF]"
                            label="Status"
                            name="status"
                            placeholder="Pilih Status"
                            options={[
                                { label: 'AKTIF', value: '1' },
                                { label: 'NON AKTIF', value: '2' },
                            ]}
                            value={formData.status}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex justify-end items-end gap-2">
                        <Button
                            bgColor="#5395FF"
                            hoverColor="#DDEBFF"
                            onClick={updatePaymentMethod}
                            disabled={isUpdating}
                        >
                            {isUpdating ? <Loading className="loading-spinner loading-xs" /> : 'SUBMIT'}
                        </Button>
                    </div>
                </Modal>
                <Modal id="delete" title="DELETE" className="bg-[#DDEBFF]">
                    <p className="text-sm mb-4">Apakah kamu yakin ingin menghapus metode pembayaran ini?</p>
                    <div className="flex justify-end items-end gap-2">
                        <Button
                            bgColor="#5395FF"
                            hoverColor="#DDEBFF"
                            onClick={deletePaymentMethod}
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
                            href: "/admin/metode",
                            icon: <LuCreditCard />,
                            label: "Metode Pembayaran",
                        },
                    ]}
                    className="bg-[#5395FF]"
                />
                <div className="grid grid-cols-[1fr_auto] gap-2">
                    <Input
                        className="bg-[#5395FF] w-full"
                        type="text"
                        placeholder="Masukan Service ID"
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
                        className="btn-square mt-3.5"
                    >
                        <LuPlus />
                    </Button>
                </div>

                <Table className="px-4 py-2 bg-[#5395FF] mt-3.5 mb-4">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>SERVICE ID</th>
                            <th>NAME</th>
                            <th>MIN</th>
                            <th>TYPE</th>
                            <th>STATUS</th>
                            <th>AKSI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="text-center"><Loading className="loading-spinner loading-xs" /></td>
                            </tr>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((item) => (
                                <tr key={item.id} className="hover:bg-base-300 !truncate">
                                    <td>{`#${item.id}`}</td>
                                    <td>{item.s_id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.min}</td>
                                    <td className="uppercase">{item.type}</td>
                                    <td className="uppercase">{item.status === '1' ? 'AKTIF' : 'NON AKTIF'}</td>
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
                                <td colSpan="7" className="text-center text-xs">
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

export default withAuth(Metode);