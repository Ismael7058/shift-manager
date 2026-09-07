import React from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
  className = ''
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`bg-[#171717] border border-white/10 rounded-2xl shadow-2xl w-full ${maxWidth} p-6 sm:p-7 relative animate-in fade-in zoom-in-95 duration-200 my-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-xl text-white text-center font-semibold tracking-tight">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;