import TaskTableRow from "./TaskTableRow";
import { useTaskContext } from "../../../providers/TaskContext"; 

function TaskTable({
  tasks,
  editingTaskId,
  editingField,
  editedTitle,
  setEditingTaskId,
  setEditingField,
  setEditedTitle,
  handleInlineEdit,
  showTooltip,
  hideTooltip,
  setSelectedTask,
  setDropdownPosition,
  setDropdownType,
}) {
  const {setTasks} = useTaskContext();
  return (
    <table className="w-auto bg-[var(--color-bg)] dark:bg-[var(--color-bg)]) backdrop-blur-md shadow-md">
      <thead className="sticky top-0 z-10 bg-[var(--color-bg-secondary)] dark:bg-[var(--color-bg-secondary)] backdrop-blur-md border-b border-[var(--color-border)] dark:border-[var(--color-border)] text-[var(--color-text)] dark:text-[var(--color-text)] text-left text-sm">
        <tr>
          <th className="px-5 py-2 text-left align-middle">Title</th>
          <th className="px-3 py-2 text-left align-middle">Description</th>
          <th className="px-3 py-2 text-center align-middle">Assignees</th>
          <th className="px-3 py-2 text-center align-middle">Status</th>
          <th className="px-3 py-2 text-center align-middle">Priority</th>
          <th className="px-2 py-2 pl-6 text-left align-middle">Due Date</th>
          <th className="px-3 py-2 text-left align-middle whitespace-nowrap">Created By</th>
          <th className="px-3 py-2 text-left align-middle whitespace-nowrap">Created On</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskTableRow
              key={task.id}
              task={task}
              editingTaskId={editingTaskId}
              editingField={editingField}
              editedTitle={editedTitle}
              setEditingTaskId={setEditingTaskId}
              setEditingField={setEditingField}
              setEditedTitle={setEditedTitle}
              handleInlineEdit={handleInlineEdit}
              setTasks={setTasks}
              showTooltip={showTooltip}
              hideTooltip={hideTooltip}
              setSelectedTask={setSelectedTask}
              setDropdownPosition={setDropdownPosition}
              setDropdownType={setDropdownType}
            />
          ))
        ) : (
          <tr>
            <td colSpan={8} className="text-center py-2 text-gray-500">
              No tasks found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default TaskTable;