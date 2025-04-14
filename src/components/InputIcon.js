const InputIcon = ({
    icon: Icon,
    type = "text",
    placeholder = "",
    value,
    onChange,
    label,
    className = "",
    inputClass = "",
    name
}) => {
    return (
        <fieldset className="fieldset flex items-center">
            <legend className="text-xs whitespace-nowrap mb-2.5 ">{label}</legend>
            <label
                className={`input input-sm w-full text-xs border-2 border-black rounded-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ease-in-out
      hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
      hover:translate-x-[2px] hover:translate-y-[2px]
      active:shadow-none active:translate-x-[3px] active:translate-y-[3px]
      ${className}`}
            >
                {Icon && <Icon />}
                <input
                    type={type}
                    name={name}
                    className={`grow ${inputClass}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            </label>
        </fieldset>
    );
};

export default InputIcon;