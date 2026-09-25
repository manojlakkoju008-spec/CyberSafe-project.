import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'safe' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple' | 'blue' | 'emerald';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    safe: 'bg-[#E8F8F2] text-[#0E7A52] border-[#B6EAD6]',
    emerald: 'bg-[#E8F8F2] text-[#0E7A52] border-[#B6EAD6]',
    warning: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
    danger: 'bg-[#FDE8E8] text-[#9B1C1C] border-[#F8B4B4]',
    info: 'bg-[#EBF5FB] text-[#0C4A7A] border-[#C2E0F4]',
    blue: 'bg-[#EBF5FB] text-[#0C4A7A] border-[#C2E0F4]',
    purple: 'bg-[#F5F3FF] text-[#5B21B6] border-[#DDD6FE]',
    neutral: 'bg-[#F7F9FC] text-[#667085] border-[#E5E7EB]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-0.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border whitespace-nowrap tracking-tight ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
