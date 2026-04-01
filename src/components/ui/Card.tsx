interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function Card({ children, className, style }: CardProps) {
  return (
    <div style={style} className={`bg-[#F5F2ED] rounded-sm shadow ${className}`}>{children}</div>
  );
}
