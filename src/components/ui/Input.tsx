"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  dark?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, dark = false, className = "", ...props },
  ref,
) {
  const base = dark
    ? "w-full rounded-2xl border border-white/12 bg-white px-4 py-3 text-sm text-[#0F172A] [color-scheme:light] outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 disabled:cursor-not-allowed disabled:bg-white/55"
    : "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-[#0F172A] outline-none placeholder:text-neutral-400 focus:border-amber-400";

  return (
    <label className="block">
      {label && (
        <span className="mb-2 block font-cinzel text-xs uppercase tracking-[0.22em] text-amber-300/80">
          {label}
        </span>
      )}
      <input ref={ref} className={`${base} ${className}`} {...props} />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </label>
  );
});

export default Input;
