"use client";

interface SectionHeaderProps {
  title: string;
  description?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  description,
  titleClassName = "text-5xl font-medium font-cinzel text-neutral-900",
  descriptionClassName = "text-lg font-cinzel text-neutral-600",
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2 className={`mb-4 ${titleClassName}`}>{title}</h2>
      {description && (
        <p className={`max-w-2xl mx-auto ${descriptionClassName}`}>{description}</p>
      )}
    </div>
  );
}
