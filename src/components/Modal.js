import React, { forwardRef } from 'react';

const Modal = forwardRef(({ id, title, children, className = "" }, ref) => {
  return (
    <dialog id={id} className="modal" ref={ref}>
      <div className={`modal-box ${className} rounded-xs border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg pb-4">{title}</h3>
        {children}
      </div>
    </dialog>
  );
});

Modal.displayName = 'Modal';

export default Modal;