"use client";

interface StepHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export default function StepHeader({ eyebrow, title, description }: StepHeaderProps) {
  return (
    <div>
      <p className="font-cinzel text-xs uppercase tracking-[0.3em] text-amber-700 mb-2">{eyebrow}</p>
      <h2 className="font-cinzel text-3xl text-[#0F172A]">{title}</h2>
      {description && <p className="text-neutral-600 mt-3 leading-7">{description}</p>}
    </div>
  );
}
