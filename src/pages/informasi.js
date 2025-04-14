import Layout from "@/layout/Layout";
import Card from "@/components/Card";
import Image from "next/image";
import Button from "@/components/Button";
import { LuArrowRight, LuCalendar, LuHouse, LuInfo } from "react-icons/lu";
import Modal from "@/components/Modal";
import Breadcrumbs from "@/components/Breadcrumbs";
import Pagination from "@/components/Pagination";
import { useState, useEffect } from "react";
import Skeleton from "@/components/Skeleton";

const Informasi = () => {
    const [informationData, setInformationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalContent, setModalContent] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [skeletonCount, setSkeletonCount] = useState(1);

    const itemsPerPage = 8;
    const getBaseURL = () =>
        process.env.NODE_ENV === "production"
            ? "https://laravel-smmnesia.vercel.app/api/api"
            : "http://localhost:8000/api";

    const openModal = (modalId, description) => {
        document.getElementById(modalId)?.showModal();
        setModalContent(description);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${getBaseURL()}/information`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setInformationData(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const handleResize = () => setSkeletonCount(window.innerWidth >= 768 ? 4 : 1);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = informationData.slice(startIndex, startIndex + itemsPerPage);

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
                        href: "/informasi",
                        icon: <LuInfo />,
                        label: "Informasi",
                    },
                ]}
                className="mt-4 sm:mt-8 bg-[#5395FF]"

            />
            <Modal id="desc" title="DESKRIPSI" className="bg-[#DDEBFF]">
                <p className="text-xs" dangerouslySetInnerHTML={{ __html: modalContent }} />
            </Modal>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                {loading
                    ? [...Array(skeletonCount)].map((_, i) => (
                        <div key={i}>
                            <Skeleton className="w-full h-[360px] rounded-lg bg-[#5395FF]" />
                        </div>
                    ))
                    : currentItems.map((item) => (
                        <Card key={item.id}>
                            <figure className="relative w-full pt-[56.25%]">
                                <Image
                                    unoptimized
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="absolute top-0 left-0 w-full h-full border-b-2 border-black !rounded-none object-cover"
                                    fill
                                    src={item.image}
                                    alt={item.title}
                                />
                            </figure>
                            <div className="card-body p-3">
                                <h2 className="card-title">{item.title}</h2>
                                <p className="text-sm flex items-center">
                                    <LuCalendar className="mr-2 mb-0.5" />
                                    {item.date}
                                </p>
                                <p
                                    className="text-xs truncate cursor-pointer"
                                    onClick={() => openModal('desc', item.description)}
                                >
                                    {item.description}
                                </p>
                                <div className="card-actions justify-end mt-3">
                                    <Button
                                        bgColor="#5395FF"
                                        hoverColor="#DDEBFF"
                                        className="w-full"
                                        onClick={() => window.open(item.link, "_blank")}
                                    >
                                        <LuArrowRight /> BUKA
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
            </div>
            <div className="flex justify-center mt-6">
                <Pagination
                    totalItems={informationData.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </Layout>
    );
};

export default Informasi;