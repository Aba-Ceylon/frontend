"use client";

import { HTMLAttributes } from "react";

type CardVariant = "default" | "dark" | "glass" | "white";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const VARIANT_CLASSES: Record<CardVariant, string> = {
  default: "luxury-card rounded-sm",
  dark:
    "rounded-sm border border-[#182231]/10 bg-[#fffdf8] text-[#182231] shadow-[0_20px_50px_rgba(17,24,39,0.05)]",
  glass:
    "rounded-sm border border-[#182231]/10 bg-[rgba(255,253,248,0.82)] text-[#182231] shadow-[0_18px_42px_rgba(17,24,39,0.05)] backdrop-blur-md",
  white:
    "rounded-sm border border-[#182231]/8 bg-[#fffdf8] text-[#182231] shadow-[0_18px_42px_rgba(17,24,39,0.04)]",
};

export default function Card({
  variant = "default",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div {...props} className={`${VARIANT_CLASSES[variant]} ${className}`}>
      {children}
    </div>
  );
}
