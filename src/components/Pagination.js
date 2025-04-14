import { useState, useEffect } from "react";
import { LuChevronsRight, LuChevronsLeft, LuChevronRight, LuChevronLeft } from "react-icons/lu";

const Pagination = ({ totalItems, itemsPerPage = 15, currentPage, onPageChange }) => {
    const [maxPageButtons, setMaxPageButtons] = useState(5);

    useEffect(() => {
        const updateMaxPageButtons = () => setMaxPageButtons(window.innerWidth >= 1024 ? 10 : 5);
        updateMaxPageButtons();
        window.addEventListener("resize", updateMaxPageButtons);
        return () => window.removeEventListener("resize", updateMaxPageButtons);
    }, []);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    const goToPage = (page) => {
        const validPage = Math.min(Math.max(1, page), totalPages);
        if (validPage !== currentPage) onPageChange(validPage);
    };

    const getPageRange = () => {
        if (totalPages <= maxPageButtons) return Array.from({ length: totalPages }, (_, i) => i + 1);
        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        if (startPage + maxPageButtons > totalPages + 1) startPage = totalPages - maxPageButtons + 1;
        return Array.from({ length: maxPageButtons }, (_, i) => startPage + i);
    };

    const buttons = [
        { onClick: () => goToPage(1), disabled: currentPage === 1, icon: <LuChevronsLeft size={16} />, ariaLabel: "First page" },
        { onClick: () => goToPage(currentPage - 1), disabled: currentPage === 1, icon: <LuChevronLeft size={16} />, ariaLabel: "Previous page" },
        ...getPageRange().map((page) => ({
            onClick: () => goToPage(page),
            disabled: false,
            icon: page,
            ariaLabel: `Page ${page}`,
            isCurrentPage: page === currentPage
        })),
        { onClick: () => goToPage(currentPage + 1), disabled: currentPage === totalPages, icon: <LuChevronRight size={16} />, ariaLabel: "Next page" },
        { onClick: () => goToPage(totalPages), disabled: currentPage === totalPages, icon: <LuChevronsRight size={16} />, ariaLabel: "Last page" },
    ];

    return (
        <div className="join shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" role="navigation"
            aria-label="Pagination">
            {buttons.map(({ onClick, disabled, icon, ariaLabel, isCurrentPage }, index) => (
                <button
                    key={index}
                    className={`join-item btn btn-xs btn-square rounded-none border-2 border-black ${disabled ? 'btn-disabled' : ''} ${icon === currentPage ? 'btn-active bg-[#5395FF]' : 'bg-base-100'}`}
                    onClick={onClick}
                    disabled={disabled} aria-label={ariaLabel}
                    aria-current={isCurrentPage ? "page" : undefined}
                >
                    {icon}
                </button>
            ))}
        </div>
    );
};

export default Pagination;