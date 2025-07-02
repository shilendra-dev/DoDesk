import React from 'react'

const TextArea = ({
    rows=5,
    cols,
    resize = "none",
    className = "",
    error,
    ...props
}) => {
    const baseClasses = "w-full px-4 py-3 rounded-lg min-h-[120px] bg-transparent text-[var(--color-placeholder)] focus:outline-none";
    const resizeClasses = `resize-${resize}`;
    const errorClasses = error
        ? "border border-red-300 "
        : "border border-gray-700 focus:ring-blue-600 ";
    
    const themeClasses = `${baseClasses} ${resizeClasses} ${errorClasses} ${className}`;

    return (
        <textarea
            rows={rows}
            cols={cols}
            className={themeClasses}
            {...props}
        />
    )
}

export default TextArea

