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
  primary: "bg-[#182231] text-white hover:bg-[#243142] disabled:opacity-40",
  secondary: "bg-[#C99A2B] text-[#101823] hover:brightness-105 disabled:opacity-40",
  outline:
    "border border-[#182231]/16 text-[#182231] hover:bg-[#182231] hover:text-white",
  ghost: "border border-[#182231]/10 bg-white/70 text-[#182231] hover:bg-white",
  amber: "bg-[#efe6d8] text-[#182231] hover:bg-[#e8dcc8] disabled:opacity-40",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-[11px]",
  md: "px-5 py-3 text-xs",
  lg: "px-8 py-4 text-sm",
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
      className={`inline-flex items-center justify-center rounded-sm font-cinzel uppercase tracking-[0.2em] transition-all duration-300 disabled:cursor-not-allowed
        ${VARIANT_CLASSES[variant]}
        ${SIZE_CLASSES[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}`}
    >
      {children}
    </button>
  );
}
