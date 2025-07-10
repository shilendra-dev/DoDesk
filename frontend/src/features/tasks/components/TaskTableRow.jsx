import BadgeLabel from "../../../shared/components/atoms/BadgeLabel";
import { SquareLibrary } from "lucide-react";

const formatDateLocal = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function TaskTableRow({
  task,
  editingTaskId,
  editingField,
  editedTitle,
  setEditingTaskId,
  setEditingField,
  setEditedTitle,
  handleInlineEdit,
  setTasks,
  showTooltip,
  hideTooltip,
  setSelectedTask,
  setDropdownPosition,
  setDropdownType,
}) {
  return (
    <tr
      className="group border-b-1 border-[var(--color-border)] dark:border-[var(--color-border)] text-sm text-[var(--color-text)] dark:text-[var(--color-text)] bg-[var(--color-bg)] dark:bg-[var(--color-bg)] hover:bg-[var(--color-bg-secondary)] dark:hover:bg-[var(--color-bg-secondary)] py-2 transition-all duration-200 overflow-visible transform hover:scale-[1.01]"
    >
      {/* Title cell */}
      <td className="px-3 py-2 text-left align-middle">
        <div className="flex justify-between items-center gap-2 group-hover:opacity-100">
          {editingTaskId === task.id && editingField === "title" ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={() => handleInlineEdit(task.id, "title", editedTitle)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleInlineEdit(task.id, "title", editedTitle);
              }}
              className="bg-transparent text-[var(--color-text)] dark:text-[var(--color-text)] text-sm rounded w-full focus:outline-none"
              autoFocus
            />
          ) : (
            <>
              <span
                className="text-[var(--color-text)] dark:text-[var(--color-text)] cursor-pointer ml-2"
                onClick={() => {
                  setEditingTaskId(task.id);
                  setEditedTitle(task.title);
                  setEditingField("title");
                }}
              >
                {task.title}
              </span>
              <SquareLibrary
                size={16}
                className="text-[var(--color-text)] dark:text-[var(--color-text)] opacity-0 group-hover:opacity-100 transform transition-all duration-150 ease-in-out scale-100 group-hover:scale-125 cursor-pointer ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTask(task);
                }}
              />
            </>
          )}
        </div>
      </td>
      {/* Description cell */}
      <td className="px-3 py-2 text-left align-middle">
        {editingTaskId === task.id && editingField === "description" ? (
          <input
            type="text"
            value={task.description || ""}
            onChange={(e) =>
              setTasks((prevTasks) =>
                prevTasks.map((t) =>
                  t.id === task.id ? { ...t, description: e.target.value } : t
                )
              )
            }
            onBlur={() => {
              handleInlineEdit(task.id, "description", task.description);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleInlineEdit(task.id, "description", task.description);
            }}
            className="bg-transparent px-2 py-1 text-[var(--color-text)] dark:text-[var(--color-text)]text-sm rounded w-full focus:outline-none whitespace-nowrap overflow-hidden text-ellipsis"
            autoFocus
            maxLength={100}
          />
        ) : (
          <span
            className="text-[var(--color-text)] dark:text-[var(--color-text)] cursor-pointer max-w-[250px] truncate block whitespace-nowrap overflow-hidden"
            onClick={() => {
              setEditingTaskId(task.id);
              setEditingField("description");
            }}
          >
            {task.description || "-"}
          </span>
        )}
      </td>
      {/* Assignees cell */}
      <td className="px-3 py-2 text-center align-middle flex justify-center">
        <div className="flex items-center -space-x-2">
          {task.assignees &&
          Array.isArray(task.assignees) &&
          task.assignees.length > 0 ? (
            <>
              {task.assignees.slice(0, 3).map((assignee, index) => (
                <div
                  key={index}
                  className="relative group"
                  style={{ zIndex: task.assignees.length - index }}
                >
                  <div
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center ring-1 ring-gray-900 shadow-lg hover:scale-105 transition-transform duration-150"
                    title={assignee.name}
                    onMouseEnter={(e) => showTooltip(assignee.name, e)}
                    onMouseLeave={hideTooltip}
                  >
                    {assignee.name?.substring(0, 2).toUpperCase()}
                  </div>
                </div>
              ))}
              {task.assignees.length > 3 && (
                <div
                  className="relative group"
                  style={{ zIndex: 0 }}
                  onMouseEnter={(e) =>
                    showTooltip(
                      task.assignees
                        .slice(3)
                        .map((assignee) => assignee.name)
                        .join(", "),
                      e
                    )
                  }
                  onMouseLeave={hideTooltip}
                >
                  <div
                    className="w-8 h-8 rounded-full bg-gray-600 text-white text-xs font-bold flex items-center justify-center ring-1 ring-gray-900 shadow-lg"
                    title={`${task.assignees.length - 3} more`}
                  >
                    +{task.assignees.length - 3}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div
              className="w-8 h-8 rounded-full bg-red-800 text-white text-xs font-bold flex items-center justify-center ring-1 ring-gray-900 shadow-lg"
              title="Not Assigned"
            >
              NA
            </div>
          )}
        </div>
      </td>
      {/* Status cell */}
      <td className="px-3 py-2 text-center align-middle whitespace-nowrap relative">
        <div className="relative inline-block text-left">
          <div
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              setEditingTaskId(task.id);
              setEditingField("status");
              setDropdownPosition({ x: rect.left, y: rect.bottom });
              setDropdownType("status");
            }}
          >
            <BadgeLabel type="status" value={String(task.status).toLowerCase()} />
          </div>
        </div>
      </td>
      {/* Priority cell */}
      <td className="px-3 py-2 text-center align-middle relative">
        <div className="relative inline-block text-left">
          <div
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              setEditingTaskId(task.id);
              setEditingField("priority");
              setDropdownPosition({ x: rect.left, y: rect.bottom });
              setDropdownType("priority");
            }}
          >
            <BadgeLabel type="priority" value={String(task.priority).toLowerCase()} />
          </div>
        </div>
      </td>
      {/* Due Date cell */}
      <td className="px-3 py-2 text-center align-middle ">
        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          defaultValue={task.due_date ? formatDateLocal(task.due_date) : ""}
          onChange={(e) => handleInlineEdit(task.id, "due_date", e.target.value)}
          className="bg-transparent text-[var(--color-text)] dark:text-[var(--color-text)] text-sm rounded focus:outline-none px-2 py-1 cursor-pointer appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
          onFocus={(e) => e.target.showPicker && e.target.showPicker()}
        />
      </td>
      {/* Created By cell */}
      <td className="px-3 py-2 text-left align-middle whitespace-nowrap">
        {task.created_by_name || "—"}
      </td>
      {/* Created On cell */}
      <td className="px-3 py-2 text-left align-middle whitespace-nowrap">
        {new Date(task.created_at).toLocaleDateString()}
      </td>
    </tr>
  );
}

export default TaskTableRow;