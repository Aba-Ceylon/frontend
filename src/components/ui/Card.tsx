"use client";

import { HTMLAttributes } from "react";

type CardVariant = "default" | "dark" | "glass" | "white";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const VARIANT_CLASSES: Record<CardVariant, string> = {
  default: "bg-[#F5F2ED] rounded-sm shadow",
  dark:    "bg-[#0F172A] border border-white/10 rounded-2xl shadow-lg",
  glass:   "bg-white/10 backdrop-blur-md border border-white/14 rounded-2xl shadow-lg",
  white:   "bg-white border border-neutral-200 rounded-xl shadow-sm",
};

export default function Card({ variant = "default", className = "", children, ...props }: CardProps) {
  return (
    <div {...props} className={`${VARIANT_CLASSES[variant]} ${className}`}>
      {children}
    </div>
  );
}
