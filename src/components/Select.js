const Select = ({ label, placeholder = 'Pilih salah satu', options = [], className = "", ...props }) => {
    return (
        <fieldset className="fieldset flex items-center">
            <legend className="text-xs whitespace-nowrap mb-2.5">{label}</legend>
            <select
                defaultValue=""
                className={`select select-sm text-xs w-full border-2 border-black rounded-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ease-in-out
                hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
                hover:translate-x-[2px] hover:translate-y-[2px]
                active:shadow-none active:translate-x-[3px] active:translate-y-[3px] ${className}`}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option, idx) => (
                    <option key={idx} value={typeof option === 'object' ? option.value : option}>
                        {typeof option === 'object' ? option.label : option}
                    </option>
                ))}
            </select>
        </fieldset>
    );
};

export default Select;
