import React from 'react'

const Select = ({
  className = "",
  children,
  error,
  ...props

}) => {
  const baseClasses = "w-full bg-[var(--color-bg-secondary)] border-none text-sm text-white rounded-sm p-1 border-1 border-[var(--color-border)] dark:border-[var(--color-border)] focus:outline-none transition-colors cursor-pointer transition ease-in-out duration-200 text-[var(--color-bg-secondary)] dark:text-[var(--color-text)] focus:outline-none transition-all duration-200 ease-in-out cursor-pointer";
  const errorClasses = error
    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
    : "";
  const themeClasses = `${baseClasses} ${errorClasses} ${className}`;

  return (
    <select 
      className={themeClasses}
      {...props}
    >
      {children}
    </select>
  );
}

export default Select