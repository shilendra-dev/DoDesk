import { Button } from '@headlessui/react';
import React from 'react';


const HeadlessButton =({
    variant = "primary",
    size = "md",
    children,
    className = "",
    ...props
}) => {
    const baseClasses = "bg-[var(--color-button)] dark:bg-[var(--color-button)] data-hover:bg-[var(--color-button-hover)] font-medium rounded-md transition-colors cursor-pointer focus:outline-none disabled:opacity-50 ";

    const variants = {
        primary: "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white",
        secondary: "text-gray-900 bg-gray-700 hover:bg-gray-200 focus:ring-gray-300",
        success: "text-white bg-green-700 hover:bg-green-700 hover:bg-green-800 focus:ring-green-300",
        navigation: "text-[var(--color-text)] dark:text-[var(--color-text)] bg-transparent hover:bg-[var(--color-bg-secondary)] focus:ring-[var(--color-bg-secondary)] focus:ring-opacity-50",
        ghost: "text-gray-400 hover:text-white transition-all duration-150 transform hover:scale-110 hover:rotate-90 flex items-center bg-transparent",
    };

    const sizes = {
        sm: "text-sm px-3 py-1.5",
        md: "text-sm px-5 py-2",
        lg: "text-base px-6 py-3"
    };

    return (
        <Button
            className = {`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </Button>
    );
};

export default HeadlessButton;