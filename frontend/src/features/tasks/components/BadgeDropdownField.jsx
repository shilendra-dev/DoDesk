import React from "react";
import TaskField from "./TaskField";
import BadgeLabel from "../../../shared/components/atoms/BadgeLabel";

function BadgeDropdownField({
  icon,
  label,
  type,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
  dropdownRef,
  className = ""
}) {
  return (
    <TaskField icon={icon} label={label} className={className}>
      <div className="relative" ref={dropdownRef}>
        <div
          className="cursor-pointer px-2 py-1"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <BadgeLabel
            type={type}
            value={value || ""}
            className="text-base px-4 py-1.5 font-semibold"
          />
        </div>
        {isOpen && (
          <div
            className="absolute left-0 top-full mt-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-md shadow-md min-w-max z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {options.map((option) => (
              <div
                key={option}
                onClick={() => onSelect(option)}
                className="px-2 w-full py-1 hover:bg-[var(--color-bg)] rounded border-b-[0.1px] border-[var(--color-accent)] cursor-pointer"
              >
                <BadgeLabel type={type} value={option} />
              </div>
            ))}
          </div>
        )}
      </div>
    </TaskField>
  );
}

export default BadgeDropdownField;