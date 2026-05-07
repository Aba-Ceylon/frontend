"use client";

import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  dark?: boolean;
}

export default function Select({ label, options, dark = false, className = "", ...props }: SelectProps) {
  const base = dark
    ? "w-full rounded-2xl border border-white/12 bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-amber-400/60"
    : "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-amber-400";

  return (
    <label className="block">
      {label && (
        <span className="mb-2 block font-cinzel text-xs uppercase tracking-[0.22em] text-neutral-600">
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
