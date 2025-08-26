import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal = ({ open, onClose, title, children }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
<div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] mt-20 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b">
          {title && <h2 className="text-lg font-bold">{title}</h2>}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
            aria-label="סגור"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: '75vh' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
