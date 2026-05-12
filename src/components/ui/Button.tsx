"use client";

import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "amber";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:  "bg-[#0F172A] text-amber-300 hover:bg-[#18243D] disabled:opacity-40",
  secondary: "bg-amber-400/60 text-white drop-shadow-[0_0_30px_rgba(201,154,43,0.5)] hover:bg-amber-400/75",
  outline:  "border border-neutral-300 text-neutral-800 hover:bg-neutral-50",
  ghost:    "border border-white/12 bg-white/5 text-white hover:bg-white/10",
  amber:    "bg-gradient-to-br from-slate-900/95 to-slate-800/95 text-white hover:opacity-90",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center font-cinzel tracking-[0.18em] uppercase rounded-md transition-all duration-300 disabled:cursor-not-allowed
        ${VARIANT_CLASSES[variant]}
        ${SIZE_CLASSES[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}`}
    >
      {children}
    </button>
  );
}
