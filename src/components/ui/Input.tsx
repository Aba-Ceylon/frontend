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
    ? 'w-full border border-[#182231]/14 bg-white px-4 py-3 text-sm text-[#182231] [color-scheme:light] outline-none transition focus:border-[#C99A2B] focus:ring-2 focus:ring-[#C99A2B]/15 disabled:cursor-not-allowed disabled:bg-white/60'
    : "w-full border border-[#182231]/14 bg-white px-4 py-3 text-sm text-[#182231] outline-none placeholder:text-[#182231]/45 transition focus:border-[#C99A2B] focus:ring-2 focus:ring-[#C99A2B]/15";

  return (
    <label className="block">
      {label && (
        <span className="mb-2 block font-cinzel text-xs uppercase tracking-[0.18em] text-[#182231]/72">
          {label}
        </span>
      )}
      <input ref={ref} className={`${base} ${className}`} {...props} />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </label>
  );
});

export default Input;
