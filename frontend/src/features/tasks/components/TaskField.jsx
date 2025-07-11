import React from "react";

const TaskField = ({ icon: Icon, label, children, className = "" }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2 text-[var(--color-text-secondary)] w-[140px] flex-shrink-0">
        <Icon size={16} />
        <label className="uppercase tracking-wide font-semibold text-xs select-none">
          {label}
        </label>
      </div>
      {children}
    </div>
  );
};

export default TaskField;
