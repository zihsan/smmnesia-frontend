/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { LuAlignJustify, LuChevronDown, LuChevronUp, LuCircleAlert, LuCircleArrowUp, LuCircleCheck, LuCircleDot, LuCreditCard, LuDice6, LuFileText, LuGift, LuHouse, LuInfo, LuLayoutDashboard, LuListOrdered, LuLogOut, LuShoppingCart, LuTicket } from 'react-icons/lu';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

const LayoutDashboard = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const mainContentRef = useRef(null);
    const footerRef = useRef(null);
    const menuLabelsRef = useRef([]);
    const menuItemsRef = useRef([]);

    const isMobile = () => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < 768;
        }
        return false;
    };

    const handleResize = () => {
        if (typeof window !== "undefined") {
            if (window.innerWidth < 768 && sidebarOpen) {
                setSidebarOpen(false);
            } else if (window.innerWidth >= 768 && !sidebarOpen) {
                setSidebarOpen(true);
            }
        }
    };

    const handleSidebarToggle = () => {
        const newSidebarOpen = !sidebarOpen;
        setSidebarOpen(newSidebarOpen);

        if (menuLabelsRef.current) {
            menuLabelsRef.current.forEach(label => {
                if (label) {
                    label.style.display = newSidebarOpen ? 'inline' : 'none';
                    setTimeout(() => {
                        if (label) label.style.opacity = newSidebarOpen ? '1' : '0';
                    }, 50);
                }
            });
        }
    };

    useEffect(() => {
        const initSidebar = () => {
            if (typeof window !== 'undefined') {
                setSidebarOpen(window.innerWidth >= 768);
            }
        };

        initSidebar();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const { current: sidebar } = sidebarRef;
        const { current: mainContent } = mainContentRef;
        const { current: footer } = footerRef;

        if (sidebar && mainContent && footer) {
            const translateClass = isMobile() ? '-translate-x-full' : 'md:translate-x-0';
            sidebar.classList.toggle(translateClass, !sidebarOpen);
            sidebar.classList.toggle('md:w-64', sidebarOpen);
            sidebar.classList.toggle('md:w-16', !sidebarOpen);
            mainContent.classList.toggle('md:ml-64', sidebarOpen);
            mainContent.classList.toggle('md:ml-16', !sidebarOpen);
            footer.classList.toggle('md:ml-64', sidebarOpen);
            footer.classList.toggle('md:ml-16', !sidebarOpen);
        }

        menuItemsRef.current?.forEach(item => {
            if (item && !isMobile()) {
                item.classList.toggle('p-3', sidebarOpen);
                item.classList.toggle('justify-center', !sidebarOpen);
                item.classList.toggle('px-1', !sidebarOpen);
                item.classList.toggle('py-3', !sidebarOpen);
            }
        });
    }, [sidebarOpen]);

    const setMenuLabelRef = (el, index) => menuLabelsRef.current[index] = el;
    const setMenuItemRef = (el, index) => menuItemsRef.current[index] = el;

    const [openDropdowns, setOpenDropdowns] = useState({});
    const toggleDropdown = (index) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const menuItems = [
        { icon: <LuLayoutDashboard size={15} />, label: "Dashboard", href: "/admin/dashboard" },
        { icon: <LuShoppingCart size={15} />, label: "Order", href: "/admin/order" },
        { icon: <LuListOrdered size={15} />, label: "Kategori", href: "/admin/kategori" },
        { icon: <LuFileText size={15} />, label: "Layanan", href: "/admin/layanan" },
        { icon: <LuInfo size={15} />, label: "Informasi", href: "/admin/informasi" },
        { icon: <LuCreditCard size={15} />, label: "Metode Pembayaran", href: "/admin/metode" },
        { icon: <LuGift size={15} />, label: "Prize", href: "/admin/prize" },
        { icon: <LuTicket size={15} />, label: "Voucher", href: "/admin/voucher" },
        { icon: <LuDice6 size={15} />, label: "Gacha Item", href: "/admin/gacha-item" },
        {
            icon: <LuCircleDot size={15} />,
            label: "Status",
            isDropdown: true,
            children: [
                { icon: <LuCircleAlert size={15} />, label: "Pending", href: "/pending" },
                { icon: <LuCircleArrowUp size={15} />, label: "Processing", href: "/processing" },
                { icon: <LuCircleCheck size={15} />, label: "Completed", href: "/completed" },
            ],
        },
    ]

    const router = useRouter();

    const { logout } = useAuth();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.clear();
        logout();
    };

    const getBaseURL = () =>
        process.env.NODE_ENV === "production"
            ? "https://laravel-smmnesia.vercel.app/api/api"
            : "http://localhost:8000/api";

    const [initial, setInitial] = useState(null);

    useEffect(() => {
        const storedInitial = localStorage.getItem("userInitial");
        const token = localStorage.getItem("token");

        if (storedInitial) {
            setInitial(storedInitial);
        } else {
            fetch(`${getBaseURL()}/user/initial`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success && data.initial) {
                        localStorage.setItem("userInitial", data.initial);
                        setInitial(data.initial);
                    }
                })
                .catch((err) => console.error("Failed to fetch initial:", err));
        }
    }, []);

    return (
        <>
            <div className="relative min-h-screen">
                <header className="bg-base-200 fixed top-0 left-0 right-0 z-10 border-b-4 border-black">
                    <div className="flex items-center justify-between h-16 px-4">
                        <div className="flex items-center">
                            <button
                                onClick={handleSidebarToggle}
                                className="p-2 -ml-1 rounded-md hover:bg-base-300 focus:outline-none"
                            >
                                <LuAlignJustify size={15} className="cursor-pointer" />
                            </button>
                            <Link href="/" className="flex items-center ml-2.5 mt-0.5">
                                <Image
                                    unoptimized
                                    src="/favicon.avif"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    alt="Brand"
                                    className="shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] border-2 border-black w-8 rounded-full mr-2.5"
                                />
                                <span className="text-xl font-medium">SmmNesia</span>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="avatar avatar-online avatar-placeholder mr-0.5 cursor-pointer">
                                    <div className="bg-[#5395FF] border-2 border-black text-black w-8 rounded-full">
                                        <span className="text-xs">{initial || "?"}</span>
                                    </div>
                                </div>
                                <ul tabIndex={0} className="menu menu-xs dropdown-content !z-50 border-2 bg-base-200 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-2 rounded-xs text-xs w-40 mt-7">
                                    <li className="hover:bg-[#5395FF] hover:rounded"><Link href="/"><LuHouse />HOME</Link></li>
                                    <li className="hover:bg-[#5395FF] hover:rounded"><button onClick={handleLogout}><LuLogOut />LOGOUT</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </header>
                <aside ref={sidebarRef} className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-base-200 mt-0.5 border-t-2 border-r-4 border-black transition-all duration-300 !z-1 transform ${isMobile() ? '-translate-x-full' : 'md:translate-x-0'} w-64`}>
                    <nav className="mt-2.5">
                        <ul className="space-y-1.5 px-2 overflow-y-auto overflow-x-hidden max-h-screen">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    {item.isDropdown ? (
                                        <div className="collapse collapse-arrow rounded-md">
                                            <input
                                                type="checkbox"
                                                className="peer absolute left-0 top-0 h-full w-full opacity-0 cursor-pointer"
                                                checked={openDropdowns[index] || false}
                                                onChange={() => toggleDropdown(index)}
                                            />
                                            <div
                                                className={`flex items-center p-2.5 rounded-md transition-colors ${openDropdowns[index] ? "bg-base-300" : ""}`}
                                            >
                                                {item.icon}
                                                <span
                                                    ref={(el) => setMenuLabelRef(el, index)}
                                                    className="ml-3 text-sm font-medium menu-label"
                                                    style={{
                                                        display: isMobile() ? (sidebarOpen ? "inline" : "none") : "inline",
                                                        opacity: isMobile() ? "1" : "1",
                                                    }}
                                                >
                                                    {item.label}
                                                </span>
                                                <div className="ml-auto">
                                                    {openDropdowns[index] ? <LuChevronUp size={15} /> : <LuChevronDown size={15} />}
                                                </div>
                                            </div>
                                            <div className={`collapse-content px-0 pb-0 z-1 ${openDropdowns[index] ? "pb-2" : "pb-0"} transition-all duration-300`}>
                                                <ul className="menu menu-sm w-full pl-12">
                                                    {item.children.map((child, childIndex) => (
                                                        <li key={`${index}-${childIndex}`} className="my-0.5 w-full">
                                                            <Link
                                                                href={child.href}
                                                                className={`flex items-center p-2 rounded-md transition-colors w-full ${router.pathname === child.href ? "bg-[#5395FF] text-black border-2 border-black" : "hover:bg-base-300"
                                                                    }`}
                                                            >
                                                                {child.icon}
                                                                <span className="ml-2 text-sm">{child.label}</span>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className={`flex items-center p-2.5 rounded-md transition-colors ${router.pathname === item.href ? "bg-[#5395FF] text-black border-2 border-black" : "hover:bg-base-300"
                                                }`}
                                        >
                                            {item.icon}
                                            <span
                                                ref={(el) => setMenuLabelRef(el, index)}
                                                className="ml-3 text-sm font-medium menu-label"
                                                style={{
                                                    display: isMobile() ? (sidebarOpen ? "inline" : "none") : "inline",
                                                    opacity: isMobile() ? "1" : "1",
                                                }}
                                            >
                                                {item.label}
                                            </span>
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>
                <main ref={mainContentRef} className={`${sidebarOpen ? 'md:ml-64' : 'md:ml-16'} pt-16 pb-8 md:pb-16 transition-all duration-300`}>
                    <div className="p-5">
                        {children}</div>
                </main>
                <footer ref={footerRef} className={`fixed bottom-0 left-0 right-0 bg-base-200 border-t-4 border-black transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-16'}`}>
                    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center py-2 px-3">
                        <div className="text-xs text-center md:text-left">Copyright © {new Date().getFullYear()} - All rights reserved SmmNesia .</div>
                        {/* <div className="flex space-x-4 mt-4 md:mt-0">

                        </div> */}
                    </div>
                </footer>
            </div>
        </>
    );
};

export default LayoutDashboard;