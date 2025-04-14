const Textarea = ({ placeholder, className = "", required = true,   label, readonly = false, ...props }) => {
    return (
        <fieldset className="fieldset flex items-center">
            <legend className="text-xs whitespace-nowrap mb-2.5 ">{label}</legend>
            <textarea
                placeholder={placeholder}
                className={`textarea w-full rounded-xs border-2 border-black text-xs input-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ease-in-out
          hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
          hover:translate-x-[2px] hover:translate-y-[2px]
          active:shadow-none active:translate-x-[3px] active:translate-y-[3px] ${className}`}
                required={required}
                readOnly={readonly}
                {...props}
            />
        </fieldset>
    );
};

export default Textarea;