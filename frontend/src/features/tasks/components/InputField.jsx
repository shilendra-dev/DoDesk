import React from "react";
import TaskField from "./TaskField";

function InputField({
  icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  className = ""
}) {
  return (
    <TaskField icon={icon} label={label} className={className}>
      <input
        id={name}
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        className="flex-1 text-[var(--color-text)] py-2 bg-transparent border-none outline-none text-l font-medium rounded-lg px-4 placeholder-[var(--color-placeholder-text)] hover:bg-[var(--color-bg-secondary)] transition-all"
        placeholder={placeholder}
      />
    </TaskField>
  );
}

export default InputField;