/* eslint-disable react-hooks/exhaustive-deps */
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";
import LayoutDashboard from "@/layout/LayoutDashboard";
import Toast from "@/components/Toast";
import Loading from "@/components/Loading";
import { withAuth } from "@/contexts/AuthContext";
import {
    LuKeyRound,
    LuLayoutDashboard,
    LuPhone,
    LuSave,
    LuShoppingBag,
    LuWallet,
} from "react-icons/lu";
import { useState, useEffect } from "react";
import Skeleton from "@/components/Skeleton";

const getBaseURL = () =>
    process.env.NODE_ENV === "production"
        ? "https://laravel-smmnesia.vercel.app/api/api"
        : "http://localhost:8000/api";

const Dashboard = () => {
    const [toastMessage, setToastMessage] = useState("");
    const [toastVisible, setToastVisible] = useState(false);
    const [password, setPassword] = useState("");
    const [settings, setSettings] = useState({
        "paydisini-key": { value_1: "", value_2: "" },
        whatsapp: { value_1: "", value_2: "" },
    });
    const [loadingSettings, setLoadingSettings] = useState({});
    const [error, setError] = useState(null);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const showToast = (message) => {
        setToastMessage(message);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const [totalPesanan, setTotalPesanan] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${getBaseURL()}/total-pesanan`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });
                const { total } = await res.json();
                setTotalPesanan(total);
            } catch (err) {
                console.error('Gagal fetch total pesanan:', err);
            }
        })();
    }, []);

    const formatRupiah = angka =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(angka);

    const [isFetchingAllSettings, setIsFetchingAllSettings] = useState(false);

    const fetchSettings = async () => {
        setIsFetchingAllSettings(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${getBaseURL()}/settings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const result = await res.json();

            if (!result.success) {
                throw new Error("Gagal mengambil pengaturan");
            }

            setSettings(result.data);
        } catch (err) {
            setError(err.message);
            showToast("Gagal mengambil pengaturan");
        } finally {
            setIsFetchingAllSettings(false);
        }
    };

    const handleChange = (name, value) => {
        setSettings((prev) => ({
            ...prev,
            [name]: { ...prev[name], value_1: value },
        }));
    };

    const getSuccessMessage = (name) => {
        switch (name) {
            case "paydisini-key":
                return "API Key berhasil disimpan";
            case "whatsapp":
                return "Nomor WhatsApp berhasil disimpan";
            default:
                return "Pengaturan berhasil disimpan.";
        }
    };

    const handleSubmitSettings = async (name) => {
        setLoadingSettings((prev) => ({ ...prev, [name]: true }));

        try {
            const { value_1, value_2 } = settings[name] || {};
            const token = localStorage.getItem("token");

            const res = await fetch(`${getBaseURL()}/settings`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, value_1, value_2 }),
            });

            const result = await res.json();

            if (!result.success) {
                throw new Error("Gagal menyimpan pengaturan");
            }

            setSettings((prev) => ({ ...prev, [name]: result.data }));
            showToast(getSuccessMessage(name));

            fetchSettings();

        } catch (err) {
            showToast("Gagal menyimpan pengaturan");
        } finally {
            setLoadingSettings((prev) => ({ ...prev, [name]: false }));
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setIsUpdatingPassword(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${getBaseURL()}/user/update-password/1`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Gagal update password.");
            }

            showToast(data.message || "Password berhasil diupdate");
            setPassword("");
            console.log("Password berhasil disimpan:", data);

        } catch (err) {
            showToast(err.message || "Gagal update password");
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    return (
        <LayoutDashboard>
            <Breadcrumbs
                items={[
                    {
                        href: "/admin/dashboard",
                        icon: <LuLayoutDashboard />,
                        label: "Dashboard",
                    },
                ]}
                className="mb-4 bg-[#5395FF]"
            />
            <Card className="!bg-[#5395FF]">
                <div className="card-body p-3">
                    <div className="flex justify-between items-center">
                        <h2 className="card-title">TOTAL PESANAN</h2>
                        <LuShoppingBag size={20} className="mr-1 mb-1" />
                    </div>
                    {totalPesanan !== null ? (
                        <>
                            {formatRupiah(totalPesanan)}
                        </>
                    ) : (
                        <Skeleton className="w-36 h-5 rounded-lg bg-[#DDEBFF]" />
                    )}
                </div>
            </Card>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3 mt-4.5 mb-2.5">
                {["paydisini-key", "whatsapp"].map((name) => (
                    <Card key={name} className="!bg-[#5395FF]">
                        <div className="card-body p-3">
                            <div className="flex justify-between items-center">
                                <h2 className="card-title">
                                    {name === "paydisini-key" ? "PAYDISINI" : "WHATSAPP"}
                                </h2>
                                {name === "paydisini-key" ? (
                                    <LuWallet size={20} className="mr-1 mb-1" />
                                ) : (
                                    <LuPhone size={20} className="mr-1 mb-1" />
                                )}
                            </div>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmitSettings(name);
                                }}
                            >
                                <Input
                                    className="bg-base-100"
                                    label={name === "paydisini-key" ? "API KEY" : "NO. WHATSAPP"}
                                    type="text"
                                    placeholder={
                                        isFetchingAllSettings ? "LOADING..." :
                                            name === "paydisini-key" ? "API KEY" : "NO. WHATSAPP"
                                    }
                                    value={
                                        isFetchingAllSettings ? "LOADING..." :
                                            settings[name]?.value_1 || ""
                                    }
                                    onChange={(e) => handleChange(name, e.target.value)}
                                    disabled={isFetchingAllSettings || loadingSettings[name]}
                                />
                                <Button
                                    className="w-full mt-2"
                                    bgColor="#DDEBFF"
                                    hoverColor="#5395FF"
                                    type="submit"
                                    disabled={loadingSettings[name]}
                                >
                                    {loadingSettings[name] ? (
                                        <Loading className="loading-spinner loading-xs" />
                                    ) : (
                                        <>
                                            <LuSave className="mr-1" />
                                            SAVE
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </Card>
                ))}
                <Card className="!bg-[#5395FF]">
                    <div className="card-body p-3">
                        <div className="flex justify-between items-center">
                            <h2 className="card-title">AKUN</h2>
                            <LuKeyRound size={20} className="mr-1 mb-1" />
                        </div>
                        <form onSubmit={handleUpdatePassword}>
                            <Input
                                className="bg-base-100"
                                label="NEW PASSWORD"
                                type="password"
                                placeholder={isFetchingAllSettings ? "LOADING..." : "NEW PASSWORD"}
                                value={isFetchingAllSettings ? "LOADING..." : password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isFetchingAllSettings || isUpdatingPassword}
                            />
                            <Button
                                type="submit"
                                className="w-full mt-2"
                                bgColor="#DDEBFF"
                                hoverColor="#5395FF"
                                disabled={isUpdatingPassword}
                            >
                                {isUpdatingPassword ? (
                                    <Loading className="loading-spinner loading-xs" />
                                ) : (
                                    <>
                                        <LuSave className="mr-1" />
                                        SAVE
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
            <Toast
                toastClassName="toast-bottom toast-end"
                alertClassName="bg-base-200"
                isVisible={toastVisible}
            >
                {toastMessage}
            </Toast>
        </LayoutDashboard>
    );
};

export default withAuth(Dashboard);