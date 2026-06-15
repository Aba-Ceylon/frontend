"use client";

import { HTMLAttributes } from "react";

type BadgeVariant = "amber" | "dark" | "light" | "green" | "red";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  amber: "border border-amber-300/40 bg-amber-50 text-amber-700",
  dark: "border border-[#182231]/12 bg-[#182231] text-white",
  light: "border border-[#182231]/10 bg-white text-[#182231]",
  green: "border border-green-200 bg-green-100 text-green-800",
  red: "border border-red-200 bg-red-100 text-red-800",
};

export default function Badge({
  variant = "amber",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={`inline-flex items-center rounded-sm px-3 py-1 text-xs font-cinzel uppercase tracking-[0.18em] ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
