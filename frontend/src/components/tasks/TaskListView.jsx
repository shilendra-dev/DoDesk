import React, {useState} from "react";
import BadgeLabel from "../atoms/BadgeLabel";
import AssignModal from "../modals/AssignModal";
import { assignTaskToMembers } from "../../api/taskApi";


function TaskListView({ tasks }) {
  const [selectedTask, setSelectedTask] = useState(null);

  const handleAssign = async (taskId, assigneeIds) => {
    try {
      await assignTaskToMembers(taskId, assigneeIds);
      // Optionally refresh tasks here
    } catch (err) {
      console.error("Failed to assign members:", err);
    }
  };

  return (
    <div className="overflow-x-auto ">
      <table className="min-w-full bg-[#101221] shadow-md overflow-hidden">
        <thead className="bg-[#090E12] border-b border-b-gray-800 text-gray-100 text-left text-sm">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Assignees</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Due Date</th>
            <th className="px-4 py-3">Created By</th>
          </tr>
        </thead>
        <tbody>
          {console.log(tasks)}
          {Array.isArray(tasks) && tasks.length > 0 ? (
            tasks.map((task) => (
              <tr
                key={task.id}
                className="border-b border-b-gray-800 hover:bg-[#090E12] text-sm text-gray-200"
              >
                <td className="px-4 py-3">{task.title}</td>
                <td className="px-4 py-3">{task.description || "-"}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    {/* Render member avatars */}
                    {task.assignees &&
                    Array.isArray(task.assignees) &&
                    task.assignees.length > 0 ? (
                      task.assignees.map((assignee, index) => (
                        <div
                          key={index}
                          className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-medium border border-gray-800"
                          title={assignee.name}
                        >
                          {assignee.name[0]?.toUpperCase()}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-500 text-xs">None</span>
                    )}

                    {/* "+" Add assignee to task button*/}
                    <button
                      title="Add Assignee"
                      className="w-7 h-7 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 text-sm font-bold"
                      onClick={() => setSelectedTask(task)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <BadgeLabel type="status" value={task.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap items-center">
                  <BadgeLabel type="priority" value={task.priority} />
                </td>
                <td className="px-4 py-3">
                  {task.due_date
                    ? new Date(task.due_date).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-4 py-3">{task.created_by_name || "—"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <AssignModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        taskId={selectedTask?.id}
        
        onAssign={handleAssign}
      />
    </div>
  );
}

export default TaskListView;
