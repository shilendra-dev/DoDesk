import React, { useState } from "react";
import BadgeLabel from "../atoms/BadgeLabel";
import AssignModal from "../modals/AssignModal";
import { assignTaskToMembers } from "../../api/taskApi";
import { useWorkspaceMembers } from "../../context/WorkspaceMembers";
import { useWorkspace } from "../../context/WorkspaceContext";
import axios from "axios";

function TaskListView({ tasks, setTasks }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const { members } = useWorkspaceMembers();
  const { selectedWorkspace } = useWorkspace();
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 15;

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const handleAssign = async (taskId, assigneeIds) => {
    setLoading(true); // Start loading
    try {
      // Call the API to assign members
      await assignTaskToMembers(taskId, assigneeIds);

      // Refetch the entire list of tasks from the backend
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5033/api/tasks/${selectedWorkspace.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the tasks state with the latest data
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to assign members:", err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="overflow-x-auto flex-1 flex flex-col">
        <div className="max-h-[620px] overflow-y-auto flex flex-col border border-transparent">
          {loading && (
            <div className="text-center py-4 text-gray-500">
              <span>Loading...</span>
            </div>
          )}

          <table className="min-w-full table-fixed bg-[#101221]/50 backdrop-blur-md shadow-md">
            {/* Table Header */}
            <thead className="sticky top-0 z-10 bg-[#090E12]/90 backdrop-blur-md border-b border-b-gray-800 text-gray-100 text-left text-sm">
            <tr>
              <th className="px-6 py-4 text-left align-middle">Title</th>
              <th className="px-6 py-4 text-left align-middle">Description</th>
              <th className="px-6 py-4 text-center align-middle">Assignees</th>
              <th className="px-6 py-4 text-center align-middle">Status</th>
              <th className="px-6 py-4 text-center align-middle">Priority</th>
              <th className="px-6 py-4 text-left align-middle">Due Date</th>
              <th className="px-6 py-4 text-left align-middle">Created By</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {Array.isArray(tasks) && tasks.length > 0 ? (
              currentTasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-b-gray-800 hover:bg-[#090E12] text-sm text-gray-200 bg-[#101221]/30 backdrop-blur-sm"
                >
                  <td className="px-6 py-4 text-left align-middle">{task.title}</td>
                  <td className="px-6 py-4 text-left align-middle">
                    {task.description || "-"}
                  </td>
                  <td className="px-6 py-4 text-center align-middle flex justify-center">
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
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center ring-2 ring-gray-900 shadow-lg hover:scale-105 transition-transform duration-150"
                                title={assignee.name}
                              >
                                {assignee.name?.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-[#1F2937]/60 backdrop-blur-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50 shadow-md border border-gray-700">
                                {assignee.name}
                              </div>
                            </div>
                          ))}
                          {task.assignees.length > 3 && (
                            <div className="relative group" style={{ zIndex: 0 }}>
                              <div
                                className="w-8 h-8 rounded-full bg-gray-600 text-white text-xs font-bold flex items-center justify-center ring-2 ring-gray-900 shadow-lg"
                                title={`${task.assignees.length - 3} more`}
                              >
                                +{task.assignees.length - 3}
                              </div>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-[#1F2937]/60 backdrop-blur-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50 shadow-md border border-gray-700">
                                {task.assignees
                                  .slice(3)
                                  .map((assignee) => assignee.name)
                                  .join(", ")}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div
                          className="w-8 h-8 rounded-full bg-red-800 text-white text-xs font-bold flex items-center justify-center ring-2 ring-gray-900 shadow-lg"
                          title="Not Assigned"
                        >
                          NA
                        </div>
                      )}

                      {/* "+" Add assignee to task button */}
                      <button
                        title="Add Assignee"
                        className="w-7 h-7 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 text-sm font-bold ml-2"
                        onClick={() => setSelectedTask(task)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center align-middle whitespace-nowrap">
                    <BadgeLabel type="status" value={task.status} />
                  </td>
                  <td className="px-6 py-4 text-center align-middle">
                    <BadgeLabel type="priority" value={task.priority} />
                  </td>
                  <td className="px-6 py-4 text-left align-middle">
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-left align-middle">
                    {task.created_by_name || "—"}
                  </td>
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
          
        {/* Pagination - sticky inside scroll container */}
        <div className="sticky bottom-0 bg-[#101221]/90 backdrop-blur-sm pt-2 pb-0 flex justify-center items-center space-x-2 text-sm text-gray-200 z-10 border-t border-gray-700">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-gray-600 bg-[#1f2937] hover:bg-[#374151] transition disabled:opacity-30"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded-md border border-gray-600 transition ${
                currentPage === index + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-[#1f2937] hover:bg-[#374151]"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-gray-600 bg-[#1f2937] hover:bg-[#374151] transition disabled:opacity-30"
          >
            Next
          </button>
        </div>
        </div>
        <AssignModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          taskId={selectedTask?.id}
          onAssign={handleAssign}
          members={members}
        />
      </div>
    </div>
  );
}

export default TaskListView;