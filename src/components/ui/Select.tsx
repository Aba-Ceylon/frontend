"use client";

import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  dark?: boolean;
}

export default function Select({ label, options, dark = false, className = "", ...props }: SelectProps) {
  const base = dark
    ? "w-full border border-[#182231]/14 bg-white px-4 py-3 text-sm text-[#182231] outline-none transition focus:border-[#C99A2B] focus:ring-2 focus:ring-[#C99A2B]/15"
    : "w-full border border-[#182231]/14 bg-white px-4 py-3 text-sm text-[#182231] outline-none transition focus:border-[#C99A2B] focus:ring-2 focus:ring-[#C99A2B]/15";

  return (
    <label className="block">
      {label && (
        <span className="mb-2 block font-cinzel text-xs uppercase tracking-[0.18em] text-[#182231]/72">
          {label}
        </span>
      )}
      <select className={`${base} ${className}`} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
