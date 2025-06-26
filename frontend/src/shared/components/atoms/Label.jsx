import React from 'react'

const Label = ({
  htmlFor,
  children,
  required = false,
  className = '',
  ...props
}) => {
  const baseClasses = "block  text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text)]";
  const formStyleClasses = "tracking-wide text-xs";
  const themeClasses = `${baseClasses} ${formStyleClasses} ${className}`;

  return (
    <label htmlFor={htmlFor} className={themeClasses} {...props}>
      {children}
      {required && <span className="text-red-500">*</span>}
    </label>
  );
};

export default Label