import React from "react";

const HeadlessInput = ({
    type = "text",
    className = "",
    variant = "default",
    error,
    ...props
}) => {
    const baseClasses = "bg-transparent w-full px-4 py-2 rounded-md transition-colors";

    const variantClasses = {
        default: " text-[var(--color-text)] dark:text-[var(--color-text)] placeholder-gray-500 block w-full rounded-lg border text-sm",
        light: "text-black placeholder-gray-400",
        ghost: "text-white placeholder-gray-400 border-none focus:ring-0",
        secondary: "dark:bg-[var(--color-bg-secondary)] dark:hover:bg-[var(--color-bg-secondary)] focus:outline-none text-[var(--color-text)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary-hover)]",
    };

    const errorClasses = error
        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
        : "";
    const themeClasses = `${baseClasses} ${variantClasses[variant] || ""} ${errorClasses} ${className}`;

    return (
        <input 
            type = {type}
            className={`${themeClasses}`}
            {...props}
        />
    );
};

export default HeadlessInput;