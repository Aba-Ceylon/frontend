interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={`bg-[#F5F2ED] rounded-sm shadow ${className}`}>{children}</div>
  );
}
