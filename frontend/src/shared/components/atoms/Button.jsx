// frontend/src/shared/components/atoms/Button.jsx
import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  ...props
}, ref) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2 rounded-md font-medium 
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      accent-primary text-white hover:accent-secondary 
      focus:ring-4 focus:ring-blue-200 active:accent-tertiary
    `,
    secondary: `
      bg-tertiary text-primary border border-primary 
      hover:bg-hover hover:border-secondary
      focus:ring-4 focus:ring-blue-100
    `,
    ghost: `
      text-secondary hover:text-primary hover:bg-hover
      focus:ring-4 focus:ring-blue-100
    `,
    danger: `
      error text-white hover:opacity-90 
      focus:ring-4 focus:ring-red-200
    `,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;