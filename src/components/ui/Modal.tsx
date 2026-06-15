"use client";

import { useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(5,7,10,0.72)] backdrop-blur-md"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className={`relative z-10 w-full ${maxWidth} overflow-hidden border border-[#182231]/12 bg-[#FBF8F2] shadow-[0_28px_90px_rgba(0,0,0,0.24)]`}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="flex items-center justify-between border-b border-[#182231]/10 px-6 py-4">
            <h3 className="font-cinzel text-xl text-[#182231]">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center border border-[#182231]/10 bg-white text-[#182231]/72 transition hover:border-[#C99A2B] hover:text-[#182231]"
            >
              <X size={16} />
            </button>
          </div>
        )}
        {!title ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-[#182231]/10 bg-white text-[#182231]/72 transition hover:border-[#C99A2B] hover:text-[#182231]"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        ) : null}
        <div className="px-5 py-5 sm:px-6 sm:py-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
