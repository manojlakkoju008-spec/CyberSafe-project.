import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-[#1261A0] text-white hover:bg-[#0E4D80] active:bg-[#0B3C65] border border-[#1261A0] shadow-xs hover:shadow-sm transition-all duration-150',
    secondary:
      'bg-white text-[#0B1F33] hover:text-[#1261A0] hover:bg-[#F7F9FC] active:bg-slate-100 border border-[#E5E7EB] hover:border-slate-300 shadow-xs transition-all duration-150',
    outline:
      'bg-white text-[#14202B] hover:text-[#1261A0] hover:bg-[#F7F9FC] active:bg-slate-100 border border-[#E5E7EB] hover:border-slate-300 shadow-xs transition-all duration-150',
    danger:
      'bg-[#DC3545] text-white hover:bg-[#B02A37] active:bg-[#8F1F2C] border border-[#DC3545] shadow-xs hover:shadow-sm transition-all duration-150',
    success:
      'bg-[#19A974] text-white hover:bg-[#13885C] active:bg-[#0F6F4B] border border-[#19A974] shadow-xs hover:shadow-sm transition-all duration-150',
    ghost:
      'bg-transparent text-[#667085] hover:text-[#0B1F33] hover:bg-[#F7F9FC] active:bg-slate-100 border border-transparent transition-colors duration-150',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 font-semibold min-h-[34px]',
    md: 'text-sm px-4 py-2 rounded-lg gap-2 font-semibold min-h-[40px]',
    lg: 'text-base px-5 py-2.5 rounded-lg gap-2.5 font-semibold min-h-[46px]',
  };

  return (
    <button
      className={`inline-flex items-center justify-center cursor-pointer font-semibold select-none focus-visible:outline-2 focus-visible:outline-[#1261A0] focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
