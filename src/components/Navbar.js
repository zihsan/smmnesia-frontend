import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
    LuAlignJustify,
    LuCircleAlert,
    LuCircleArrowUp,
    LuCircleCheck,
    LuCircleDot,
    LuHouse,
    LuInfo,
    LuLayoutDashboard,
    LuUserSearch,
    LuLogOut
} from 'react-icons/lu';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="navbar bg-base-100 border-b-4 border-black">
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost hover:bg-base-100 hover:border-none btn-xs bg-base-100 border-none text-xl">
                    <Image
                        unoptimized
                        src="/favicon.avif"
                        alt="Favicon"
                        sizes="100vw"
                        width={0}
                        height={0}
                        className="shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] border-2 border-black w-8 rounded-full mr-2"
                    />
                    SmmNesia
                </Link>
            </div>
            <div className="flex-none">
                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn m-0 btn-ghost bg-base-100 border-none btn-xs !hover:bg-base-100 !hover:border-none"
                    >
                        <LuAlignJustify size={30} />
                    </div>
                    {mounted && (
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu z-10 w-40 p-2 border-2 bg-base-100 menu-xs text-xs rounded-xs border-black mt-7 mr-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                        >
                            <li className="hover:bg-[#5395FF] hover:rounded">
                                <Link href="/"><LuHouse className="mb-0.5" />HOME</Link>
                            </li>
                            {!user ? (
                                <>
                                {/* <li className="hover:bg-[#5395FF] hover:rounded">
                                    <Link href="/auth/login"><LuUserSearch className="mb-0.5" />LOGIN</Link>
                                </li> */}
                                </>
                            ) : (
                                <>
                                    <li className="hover:bg-[#5395FF] hover:rounded">
                                        <Link href="/admin/dashboard"><LuLayoutDashboard className="mb-0.5" />DASHBOARD</Link>
                                    </li>
                                </>
                            )}

                            <li className="hover:bg-[#5395FF] hover:rounded">
                                <Link href="/informasi"><LuInfo className="mb-0.5" />INFORMASI</Link>
                            </li>
                            <li>
                                <details>
                                    <summary className="hover:bg-[#5395FF] hover:rounded"><LuCircleDot className="mb-0.5" />STATUS</summary>
                                    <ul>
                                        <li className="hover:bg-[#DDEBFF] hover:rounded"><Link href="/pending"><LuCircleAlert className="mb-0.5" />PENDING</Link></li>
                                        <li className="hover:bg-[#DDEBFF] hover:rounded"><Link href="/processing"><LuCircleArrowUp className="mb-0.5" />PROCESSING</Link></li>
                                        <li className="hover:bg-[#DDEBFF] hover:rounded"><Link href="/completed"><LuCircleCheck className="mb-0.5" />COMPLETED</Link></li>
                                    </ul>
                                </details>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;