import { LuInfo } from "react-icons/lu";

const Toast = ({ children, toastClassName = '', alertClassName = '', isVisible }) => (
  <div
    className={`toast !z-50 ${toastClassName} ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-500`}
  >
    <div className={`alert border-2 border-black rounded-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${alertClassName}`}>
      <span className="flex text-xs items-center">
        <LuInfo className="mr-2 mb-0.5" />
        {children}
      </span>
    </div>
  </div>
);

export default Toast;