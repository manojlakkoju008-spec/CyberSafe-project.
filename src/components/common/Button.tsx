import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
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
    primary: 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 shadow-sm border border-slate-900/10',
    secondary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm border border-blue-700/20',
    outline: 'bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 border border-slate-200 shadow-xs',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm border border-rose-700/20',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 border-transparent'
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 font-medium',
    md: 'text-sm px-4 py-2 rounded-lg gap-2 font-medium',
    lg: 'text-base px-5 py-2.5 rounded-xl gap-2.5 font-semibold'
  };

  return (
    <button
      className={`inline-flex items-center justify-center cursor-pointer transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
