const Table = ({ className, tableClassName, children }) => {
    return (
        <div
            className={`overflow-x-auto rounded-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black ${className}`}
        >
            <table className={`table table-xs !text-xs ${tableClassName}`}>
                {children}
            </table>
        </div>
    );
};

export default Table;