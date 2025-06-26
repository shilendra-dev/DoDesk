import React from "react";

const Checkbox = ({
  label,
  id,
  checked = false,
  onChange,
  className = "",
  ...props
}) => {
  return (
    <div>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className={`w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded 
            focus:ring-2 focus:ring-blue-500 hover:ring-blue-400 transition 
            duration-200 cursor-pointer ${className}`}
        {...props}
      />
      {label && (<label
          htmlFor={id}
          className="text-sm font-medium text-gray-300 cursor-pointer select-none"
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
