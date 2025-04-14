const Alert = ({ icon, message, bgColor = '#5395FF' }) => {
    return (
        <div
            role="alert"
            className="alert text-xs w-full border-2 border-black rounded-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: bgColor }}
        >
            {icon && <div>{icon}</div>}
            <span className="text-xs">{message}</span>
        </div>
    );
};

export default Alert;