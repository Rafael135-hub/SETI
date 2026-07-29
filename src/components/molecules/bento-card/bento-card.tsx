import { ReactNode } from "react";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
}

export default function BentoCard({ children, className = "" }: BentoCardProps) {
  return (
    <article className={`seti-glass-card rounded-[12px] p-3 md:p-4 ${className}`}>
      {children}
    </article>
  );
}
