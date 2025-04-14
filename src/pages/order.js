import Layout from "@/layout/Layout";
import {
    LuHistory,
    LuHouse,
    LuInfo,
    LuListOrdered,
    LuPhoneCall,
    LuQrCode
} from "react-icons/lu";
import Breadcrumbs from "@/components/Breadcrumbs";
import Table from "@/components/Table";
import { useState, useEffect } from "react";
import Card from "@/components/Card";
import Alert from "@/components/Alert";
import Modal from "@/components/Modal";
import { QRCodeCanvas } from "qrcode.react";
import Loading from "@/components/Loading";

const Order = ({ phoneNumber }) => {
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        const savedOrder = localStorage.getItem("currentOrder");
        if (savedOrder) {
            try {
                const parsed = JSON.parse(savedOrder);
                console.log("✅ Loaded order from localStorage:", parsed);
                setOrderData(parsed);
            } catch (error) {
                console.error("❌ Failed to parse localStorage:", error);
            }
            localStorage.removeItem("currentOrder");
        }
    }, []);

    const openModal = (modalId) => {
        document.getElementById(modalId)?.showModal();
    };

    if (!orderData) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <Loading className="loading-spinner loading-xs" />
                </div>
            </Layout>
        );
    }

    const { order, qr } = orderData;
    const qrContent = qr.data?.qr_content || "";
    console.log("📦 QR Content:", qrContent);

    return (
        <Layout>
            <Modal id="qr" title="QR CODE" className="bg-[#DDEBFF]">
                <div className="flex justify-center flex-col items-center gap-2">
                    {qrContent ? (
                        <>
                            <QRCodeCanvas
                                key={qrContent}
                                value={qrContent}
                                size={300}
                                level="L"
                                className="rounded-none"
                            />
                            {/* <p className="text-sm mt-1 text-center break-words max-w-xs">
                                {qrContent}
                            </p> */}
                        </>
                    ) : (
                        <>
                            <p>QR Content kosong 😢</p>
                            <p>Silakan hubungi admin</p>
                        </>
                    )}
                </div>
            </Modal>
            <Breadcrumbs
                items={[
                    { href: "/", icon: <LuHouse />, label: "Home" },
                    { href: "/order", icon: <LuListOrdered />, label: "Order" }
                ]}
                className="mt-4 sm:mt-8 bg-[#5395FF] mb-4"
            />
            <Alert
                icon={<LuInfo />}
                message="Jangan lupa Screenshot Jika Sudah Melakukan Transfer Lalu Hubungi Admin di WhatsApp"
                bgColor="#5395FF"
            />
            <Card className="p-4 mt-4 !bg-[#5395FF]">
                <div className="mb-4 flex justify-between items-center">
                    <p className="text-xl">INVOICE SMMNESIA.ID</p>
                    <LuHistory size={23} className="mr-1.5 mb-0.5" />
                </div>

                <div className="overflow-x-auto">
                    <table className="table table-xs !text-xs">
                        <thead>
                            <tr>
                                <th>NO INVOICE</th>
                                <th>TANGGAL DIBUAT</th>
                                <th>AKSI</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-base-300 !truncate">
                                <td>{order.oid}</td>
                                <td>{new Date(order.create_at).toLocaleString()}</td>
                                <td>
                                    <div className="join">
                                        <button
                                            onClick={() => openModal("qr")}
                                            className="hidden lg:flex items-center btn btn-xs join-item border-2 border-black bg-[#DDEBFF]"
                                        >
                                            <LuQrCode /> QR CODE
                                        </button>
                                        <a
                                            href={`https://api.whatsapp.com/send/?phone=${phoneNumber}&text=Halo, saya sudah melakukan pembayaran untuk order ${order.oid}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-xs join-item border-2 border-black bg-[#DDEBFF]"
                                        >
                                            <LuPhoneCall /> WHATSAPP
                                        </a>
                                    </div>
                                </td>
                                <td>{order.status_pay.toUpperCase()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
            <Card className="p-4 mt-4 !bg-[#5395FF] block md:hidden">
                <QRCodeCanvas
                    key={qrContent}
                    value={qrContent}
                    size={300}
                    level="L"
                    className="rounded-none"
                />
            </Card>
            <Table className="px-4 py-2 bg-[#5395FF] mt-3.5">
                <thead>
                    <tr>
                        <th>KATEGORI</th>
                        <th>LAYANAN</th>
                        <th>TARGET</th>
                        <th>HARGA</th>
                        <th>STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="hover:bg-base-300 !truncate">
                        <td>{order.kategori}</td>
                        <td>{order.layanan}</td>
                        <td>{order.target}</td>
                        <td>Rp {parseInt(order.harga).toLocaleString("id-ID")}</td>
                        <td>{order.status}</td>
                    </tr>
                </tbody>
            </Table>
        </Layout>
    );
};

export default Order;

export async function getServerSideProps() {
    const baseURL =
        process.env.NODE_ENV === "production"
            ? "https://laravel-smmnesia.vercel.app/api/api"
            : "http://localhost:8000/api";

    try {
        const res = await fetch(`${baseURL}/get-phone-number`);
        const data = await res.json();

        return {
            props: {
                phoneNumber: data.phone_number || ""
            }
        };
    } catch (error) {
        console.error("SSR Error:", error);
        return {
            props: {
                phoneNumber: ""
            }
        };
    }
}
