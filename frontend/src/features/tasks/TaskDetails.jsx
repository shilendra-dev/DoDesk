import React, { useState } from "react";
import { Text, AlignLeft, Flag, CheckSquare, Calendar, User } from "lucide-react";

import NotesEditor from "./richTextEditor/NotesEditor";
import useTaskEditor from "./hooks/useTaskEditor";
import TaskDetailsHeader from "./components/TaskDetailsHeader";
import InputField from "./components/InputField";
import BadgeDropdownField from "./components/BadgeDropdownField";
import AssigneesField from "./components/AssigneesField";
import TaskField from "./components/TaskField";

function TaskDetails({ task, isOpen, onClose, onAddAssignee }) {
  const {
    // ... all your existing useTaskEditor destructuring
    editedTask,
    notes,
    dropdownType,
    showAssigneeDropdown,
    dropdownMembers,
    newlyAddedAssigneeIds,
    statusDropdownRef,
    priorityDropdownRef,
    handleAutoSaveChange,
    handleBadgeSelect,
    handleNotesUpdate,
    handleAssign,
    handleRemoveAssignee,
    handleAssigneeDropdownToggle,
    setDropdownType,
  } = useTaskEditor(task);

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleAssignWrapper = async (taskId, assigneeIds) => {
    const result = await handleAssign(taskId, assigneeIds);
    if (onAddAssignee) onAddAssignee(taskId, assigneeIds);
    return result;
  };

  if (!isOpen || !task || !editedTask) return null;

  return (
    <div className={`fixed top-0 right-0 w-[1000px] max-w-full h-full border-l border-[var(--color-border)] bg-[var(--color-bg)] z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isClosing ? "translate-x-full" : "translate-x-0"} task-details-enter`}>
      
      <TaskDetailsHeader
        title={editedTask?.title}
        onClose={handleClose}
        isClosing={isClosing}
      />

      <div className="flex-1 overflow-y-auto p-6 pt-3 space-y-6">
        <InputField
          icon={Text}
          label="Title"
          name="title"
          value={editedTask?.title}
          onChange={handleAutoSaveChange}
          placeholder="Enter task title"
        />

        <div className="flex flex-col gap-4">
          <BadgeDropdownField
            icon={CheckSquare}
            label="Status"
            type="status"
            value={editedTask?.status}
            options={["pending", "in-progress", "completed"]}
            isOpen={dropdownType === "status"}
            onToggle={() => setDropdownType(dropdownType === "status" ? null : "status")}
            onSelect={(option) => handleBadgeSelect("status", option)}
            dropdownRef={statusDropdownRef}
          />

          <BadgeDropdownField
            icon={Flag}
            label="Priority"
            type="priority"
            value={editedTask?.priority}
            options={["high", "mid", "low"]}
            isOpen={dropdownType === "priority"}
            onToggle={() => setDropdownType(dropdownType === "priority" ? null : "priority")}
            onSelect={(option) => handleBadgeSelect("priority", option)}
            dropdownRef={priorityDropdownRef}
            className="mt-2"
          />
        </div>

        <InputField
          icon={Calendar}
          label="Due Date"
          name="due_date"
          type="date"
          value={editedTask?.due_date ? new Date(editedTask.due_date).toISOString().split("T")[0] : ""}
          onChange={handleAutoSaveChange}
        />

        <AssigneesField
          assignees={editedTask.assignees || []}
          newlyAddedAssigneeIds={newlyAddedAssigneeIds}
          showDropdown={showAssigneeDropdown}
          dropdownMembers={dropdownMembers}
          onToggleDropdown={handleAssigneeDropdownToggle}
          onAssign={handleAssignWrapper}
          onRemoveAssignee={handleRemoveAssignee}
          taskId={editedTask.id}
        />

        <TaskField icon={User} label="Created By">
          <p className="text-[var(--color-text)] font-medium px-4">
            {task.created_by_name || "—"}
          </p>
        </TaskField>

        <div>
          <NotesEditor
            initialContent={notes}
            onUpdate={(newContent) => handleNotesUpdate(newContent)}
          />
        </div>
      </div>

      {/* Keep your existing styles */}
      <style>{/* ... existing styles ... */}</style>
    </div>
  );
}

export default TaskDetails;