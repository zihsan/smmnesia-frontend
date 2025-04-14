/* eslint-disable react-hooks/exhaustive-deps */
import Breadcrumbs from "@/components/Breadcrumbs";
import Input from "@/components/Input";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import LayoutDashboard from "@/layout/LayoutDashboard";
import { LuDelete, LuLayoutDashboard, LuPen, LuShoppingCart } from "react-icons/lu";
import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Select from "@/components/Select";
import Toast from "@/components/Toast";
import { withAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";

const Order = () => {

    const [toastMessage, setToastMessage] = useState('');
    const [toastVisible, setToastVisible] = useState(false);

    const showToast = (message) => {
        setToastMessage(message);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
    };

    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updateFormData, setUpdateFormData] = useState({ status: '', status_pay: '' });
    const [isLoading, setIsLoading] = useState(false);

    const getBaseURL = () =>
        process.env.NODE_ENV === 'production'
            ? 'https://laravel-smmnesia.vercel.app/api/api'
            : 'http://localhost:8000/api';

    const getAuthToken = () => {
        return localStorage.getItem('token');
    };

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${getBaseURL()}/orders`, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                },
            });
            if (!res.ok) throw new Error(`Error: ${res.status} - ${res.statusText}`);
            const data = await res.json();
            data.status === 'success' ? setOrders(data.data) : setOrders([]);
        } catch (err) {
            console.error('Error fetching orders:', err.message);
            showToast('Failed to fetch orders');
        } finally {
            setIsLoading(false);
        }
    };

    const updateOrder = async (e) => {
        e.preventDefault();
        if (!selectedOrder) return;

        console.log('Current order state:', selectedOrder);
        console.log('Update form data:', updateFormData);

        setIsLoading(true);
        try {
            const res = await fetch(`${getBaseURL()}/orders/${selectedOrder.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`,
                },
                body: JSON.stringify({
                    status: updateFormData.status.trim(),
                    status_pay: updateFormData.status_pay.trim()
                }),
            });

            const data = await res.json();
            console.log('Update response:', data);

            if (res.ok && data.status === 'success') {
                fetchOrders();
                closeModal('update');
                showToast('Order updated successfully!');
            } else {
                showToast(data.message || 'Update failed');
            }
        } catch (err) {
            console.error('Error updating order:', err);
            showToast('Failed to update order');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteOrder = async () => {
        if (!selectedOrder) return;

        setIsLoading(true);
        try {
            const res = await fetch(`${getBaseURL()}/orders/${selectedOrder.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                },
            });
            if (!res.ok) throw new Error(`Error: ${res.status} - ${res.statusText}`);
            const data = await res.json();
            if (data.status === 'success') {
                fetchOrders();
                closeModal('delete');
                showToast('Order deleted successfully!');
            } else {
                showToast(data.message);
            }
        } catch (err) {
            console.error('Error deleting order:', err.message);
            showToast('Failed to delete order');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredData = orders.filter(order =>
        order.oid.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentItems = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const openModal = (modalId, order = null) => {
        if (order) {
            setSelectedOrder(order);
            if (modalId === 'update') {
                setUpdateFormData({
                    status: order.status || '',
                    status_pay: order.status_pay || ''
                });
            }
        }

        console.log('Editing Order:', order);
        document.getElementById(modalId)?.showModal();
    };

    const closeModal = (modalId) => {
        document.getElementById(modalId)?.close();
        setSelectedOrder(null);
        setUpdateFormData({ status: '', status_pay: '' });
    };

    const handleInputChange = ({ target: { name, value } }) => {
        setUpdateFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <LayoutDashboard>
                <Modal id="update" title="UPDATE" className="bg-[#DDEBFF]">
                    <form onSubmit={updateOrder}>
                        <div className="space-y-5 mb-4">
                            <Select
                                className="bg-[#5395FF] uppercase"
                                label="Status"
                                name="status"
                                placeholder="Status"
                                value={updateFormData.status}
                                onChange={handleInputChange}
                                options={['Pending', 'Process', 'Success', 'Cancel', 'Error']}
                            />
                            <Select
                                className="bg-[#5395FF] uppercase"
                                label="Status Pembayaran"
                                name="status_pay"
                                placeholder="Status Pembayaran"
                                value={updateFormData.status_pay}
                                onChange={handleInputChange}
                                options={['paid', 'unpaid', 'process']}
                            />
                        </div>
                        <div className="flex justify-end items-end">
                            <Button
                                type="submit"
                                bgColor="#5395FF"
                                hoverColor="#DDEBFF"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loading className="loading-spinner loading-xs" /> : 'SUBMIT'}
                            </Button>
                        </div>
                    </form>
                </Modal>

                <Modal id="delete" title="DELETE" className="bg-[#DDEBFF]">
                    <p className="text-sm mb-4">
                        Apakah kamu yakin ingin menghapus data ini?
                    </p>
                    <div className="flex justify-end items-end">
                        <Button
                            onClick={deleteOrder}
                            bgColor="#5395FF"
                            hoverColor="#DDEBFF"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loading className="loading-spinner loading-xs" /> : 'SUBMIT'}
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
                            href: "/admin/order",
                            icon: <LuShoppingCart />,
                            label: "Order",
                        },
                    ]}
                    className="bg-[#5395FF]"
                />
                <Input
                    className="bg-[#5395FF]"
                    type="text"
                    placeholder="Masukan OID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Table className="px-4 py-2 bg-[#5395FF] mt-3.5 mb-4">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>OID</th>
                            <th>KATEGORI</th>
                            <th>LAYANAN</th>
                            <th>TARGET</th>
                            <th>HARGA</th>
                            <th>METODE PEMBAYARAN</th>
                            <th>STATUS PEMESANAN</th>
                            <th>STATUS PEMBAYARAN</th>
                            <th>AKSI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item) => (
                                <tr key={item.id} className="hover:bg-base-300 !truncate">
                                    <td>{`#${item.id}`}</td>
                                    <td>{item.oid}</td>
                                    <td>{item.kategori}</td>
                                    <td>{item.layanan}</td>
                                    <td>{item.target}</td>
                                    <td>{item.harga}</td>
                                    <td className="uppercase">{item.method_name}</td>
                                    <td className="uppercase">{item.status}</td>
                                    <td className="uppercase">{item.status_pay}</td>
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
                                <td colSpan="10" className="text-center text-xs ">
                                    {isLoading ? <Loading className="loading-spinner loading-xs" /> : 'Data tidak ditemukan'}
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

export default withAuth(Order);