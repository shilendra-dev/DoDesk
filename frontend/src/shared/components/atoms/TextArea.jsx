import React from 'react'

const TextArea = ({
    rows=5,
    cols,
    resize = "none",
    className = "",
    error,
    ...props
}) => {
    const baseClasses = "w-full px-4 py-3 rounded-lg min-h-[120px] bg-transparent text-gray-200 focus:outline-none focus:ring-2 transition-colors";
    const resizeClasses = `resize-${resize}`;
    const errorClasses = error
        ? "border border-red-300 focus:ring-red-500 focus:border-red-500"
        : "border border-gray-700 focus:ring-blue-600 focus:border-blue-500";
    
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

