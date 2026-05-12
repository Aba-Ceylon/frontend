"use client";

import { HTMLAttributes } from "react";

type BadgeVariant = "amber" | "dark" | "light" | "green" | "red";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  amber: "bg-amber-400/20 text-amber-700 border border-amber-300/40",
  dark:  "bg-[#0F172A]/80 text-white border border-white/10",
  light: "bg-white/10 text-white/80 border border-white/15",
  green: "bg-green-100 text-green-800 border border-green-200",
  red:   "bg-red-100 text-red-800 border border-red-200",
};

export default function Badge({ variant = "amber", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-cinzel uppercase tracking-[0.18em] ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
