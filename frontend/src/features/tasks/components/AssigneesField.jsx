import React from "react";
import { User } from "lucide-react";
import TaskField from "./TaskField";

function AssigneesField({
  assignees = [],
  newlyAddedAssigneeIds = [],
  showDropdown,
  dropdownMembers = [],
  onToggleDropdown,
  onAssign,
  onRemoveAssignee,
  taskId
}) {
  return (
    <TaskField icon={User} label="Assignees" className="items-start">
      <div className="flex-1 relative">
        <div className="flex items-center flex-wrap gap-2 mb-2 px-1 transition-all duration-300">
          {assignees.map((assignee) => (
            <div
              key={assignee.id}
              className={`group inline-flex items-center justify-center h-6 px-4 bg-[var(--color-badge)] text-[var(--color-text)] text-sm font-medium rounded-full hover:bg-[var(--color-ghost)] transition-all duration-300 ease-in-out transform ${
                newlyAddedAssigneeIds.includes(assignee.id) ? "fade-in" : ""
              }`}
            >
              <div className="relative flex items-center justify-center group">
                <span className="text-[var(--color-text-secondary)] transition-opacity duration-200 group-hover:opacity-60 whitespace-nowrap">
                  {assignee.name}
                </span>
                <button
                  className="absolute inset-0 m-auto w-4 h-4 flex items-center justify-center cursor-pointer text-white bg-red-600 hover:bg-red-700 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                  title="Remove"
                  onClick={() => onRemoveAssignee(assignee.id)}
                >
                  −
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={onToggleDropdown}
            className="h-7 w-7 rounded-full bg-[var(--color-bg-secondary)] hover:bg-[var(--color-button-hover)] cursor-pointer text-[var(--color-text)] flex items-center justify-center text-sm transition-all duration-200 hover:scale-110 shadow-md"
          >
            +
          </button>
        </div>
        
        {showDropdown && (
          <div className="absolute top-full left-0 mt-2 w-56 bg-[var(--color-bg-secondary)] text-[var(--color-text)] rounded-lg shadow-xl border border-[var(--color-border)] z-50 max-h-48 overflow-y-auto backdrop-blur-sm bg-opacity-95">
            {dropdownMembers?.map((member) => (
              <div
                key={member.id}
                onClick={() => onAssign(taskId, [member.user_id])}
                className="px-4 py-2.5 hover:bg-[var(--color-ghost)] cursor-pointer text-sm transition-colors duration-200 flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-[var(--color-placeholder-text)] flex items-center justify-center text-xs">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                {member.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </TaskField>
  );
}

export default AssigneesField;