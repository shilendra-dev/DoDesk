import React from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils"; // optional classNames utility

const MODAL_SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  variant = "modal", // "modal" or "drawer"
  size = "md",
  closeOnBackdrop = true,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Backdrop click */}
      {closeOnBackdrop && (
        <div
          className="absolute inset-0 z-10"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          "relative z-20 w-full bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg shadow-lg overflow-hidden transition-all",
          variant === "modal" && MODAL_SIZES[size],
          variant === "drawer" && "fixed top-0 right-0 h-full max-w-sm w-full rounded-none"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
          <h2 className="text-lg font-medium">{title}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;