import React from "react";
import { ChevronRight } from "lucide-react";

function TaskDetailsHeader({ title, onClose }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] backdrop-blur-sm sticky top-0 z-10">
      <h2 className="text-xl font-semibold text-[var(--color-text)] truncate flex items-center gap-2">
        <span className="text-[var(--color-text)]">#</span>
        {title || "Untitled Task"}
      </h2>
      <button
        onClick={onClose}
        className="text-[var(--color-text)] hover:text-[var(--color-text-hover)] transition-all duration-150 transform hover:scale-110 hover:rotate-90 cursor-pointer flex items-center"
        aria-label="Close drawer"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

export default TaskDetailsHeader;