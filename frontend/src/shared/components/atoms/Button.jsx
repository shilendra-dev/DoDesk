import React from 'react';

const Button =({
    variant = "primary",
    size = "md",
    children,
    className = "",
    ...props
}) => {
    const baseClasses = "font-medium rounded-md transition-colors focus:outline-none focus:ring-2";

    const variants = {
        primary: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700",
        secondary: "text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-gray-300",
        success: "text-white bg-green-700 hover:bg-green-700 hover:bg-green-800 focus:ring-green-300"
    };

    const sizes = {
        sm: "text-sm px-3 py-1.5",
        md: "text-sm px-5 py-2.5",
        lg: "text-base px-6 py-3"
    };

    return (
        <button
            className = {`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;