import React from "react";

const Input = ({
    type = "text",
    className = "",
    variant = "default",
    error,
    ...props
}) => {
    const baseClasses = "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors";
    
    const variantClasses = {
        default: "bg-[#1e293b] text-white placeholder-gray-500",
        light: "bg-white text-black placeholder-gray-400",
        ghost: "bg-transparent text-white placeholder-gray-400 border-none focus:ring-0",
    };

    const errorClasses = error
        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
        : "border-gray-700 focus:ring-blue-500 focus:border-blue-500";
    const themeClasses = `${baseClasses} ${variantClasses[variant] || ""} ${errorClasses} ${className}`;

    return (
        <input 
            type = {type}
            className={`${themeClasses}`}
            {...props}
        />
    );
};

export default Input;