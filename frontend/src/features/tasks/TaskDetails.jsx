import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { getAllWorkspaceMembers } from "../workspace/workspace";
import {
  ChevronRight,
  Text,
  AlignLeft,
  Flag,
  CheckSquare,
  Calendar,
  User,
} from "lucide-react";
import {
  assignTaskToMembers,
  removeAssignee,
  updateTask,
} from "./taskApi";

import axios from "axios";
import NotesEditor from "./richTextEditor/NotesEditor";
import BadgeLabel from "../../shared/components/atoms/BadgeLabel";

function TaskDetails({ task, isOpen, onClose, onAddAssignee, setTasks }) {
  const [editedTask, setEditedTask] = useState(task);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [dropdownMembers, setDropdownMembers] = useState([]);
  const [newlyAddedAssigneeIds, setNewlyAddedAssigneeIds] = useState([]);
  const [isClosing, setIsClosing] = useState(false);

  //for badge label
  const [dropdownType, setDropdownType] = useState(null);
  const badgeDropdownRef = useRef(null);

  // Auto-close badge dropdown on outside click
  useEffect(() => {
    if (!dropdownType) return;
    const handleClick = (e) => {
      if (
        badgeDropdownRef.current &&
        !badgeDropdownRef.current.contains(e.target)
      ) {
        setDropdownType(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownType]);

  useEffect(() => {
    setEditedTask(task);
    setNotes(task?.notes || "");
    setNewlyAddedAssigneeIds([]);
  }, [task]);

  //for badge label
  const handleBadgeClick = (type, e) => {
    e.stopPropagation();
    setDropdownType(type);
  };

  // handler for badge dropdown select
  const handleBadgeSelect = async (type, value) => {
    const updated = { ...editedTask, [type]: value };
    setEditedTask(updated);
    setDropdownType(null);
    try {
      await updateTask(updated.id, updated);
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === updated.id ? { ...t, [type]: value } : t
        )
      );
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const [notes, setNotes] = useState((task && task.notes) || "");

  const handleNotesUpdate = async (newNotes) => {
    setNotes(newNotes);
    console.log("Updating notes:", newNotes);
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5033/api/task/${task.id}/notes`,
        { notes: newNotes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating notes:", error);
      toast.error("Failed to update notes");
    }
  };

  if (!isOpen || !task || !editedTask) return null;

  const handleAutoSaveChange = async (e) => {
    const { name, value } = e.target;

    const updated = { ...editedTask, [name]: value };
    setEditedTask(updated);

    try {
      await updateTask(updated.id, updated);
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === updated.id ? { ...t, [name]: value } : t
        )
      );
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleAssign = async (taskId, assigneeIds) => {
    try {
      await assignTaskToMembers(taskId, assigneeIds);

      if (task.workspace_id) {
        const updatedTaskResponse = await axios.get(
          `http://localhost:5033/api/workspace/${task.workspace_id}/tasks`, //workspace/:workspace_id/tasks
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const updatedTasks = updatedTaskResponse.data.tasks;
        const updatedTask = updatedTasks.find((t) => t.id === task.id);
        if (updatedTask) {
          setEditedTask(updatedTask);
        }
      }

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                assignees: [
                  ...(t.assignees || []),
                  ...dropdownMembers
                    .filter((m) => assigneeIds.includes(m.user_id))
                    .map((m) => ({
                      id: m.id,
                      user_id: m.user_id,
                      name: m.name,
                    })),
                ],
              }
            : t
        )
      );

      setNewlyAddedAssigneeIds(assigneeIds);
      if (onAddAssignee) onAddAssignee(taskId, assigneeIds);
      setShowAssigneeDropdown(false);
      toast.success("Assignee added successfully");
    } catch (error) {
      console.error("Failed to assign member:", error);
      if (error.response && error.response.status === 409) {
        toast.error("Member is already assigned");
      } else {
        toast.error("Failed to assign member");
      }
    }
  };

  const handleRemoveAssignee = async (userId) => {
    try {
      await removeAssignee(task.id, userId);
      toast.success("Assignee removed successfully");
      setEditedTask((prev) => ({
        ...prev,
        assignees: (prev.assignees || []).filter(
          (assignee) => assignee.id !== userId
        ),
      }));
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id
            ? {
                ...t,
                assignees: (t.assignees || []).filter((a) => a.id !== userId),
              }
            : t
        )
      );
    } catch (error) {
      console.error("Failed to remove assignee:", error);
      toast.error("Failed to remove assignee");
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 w-[1000px] max-w-full h-full border-l border-[var(--color-border)] dark:border-[var(--color-border)] bg-[#0f101e] z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
        isClosing ? "translate-x-full" : "translate-x-0"
      } task-details-enter`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#141528] backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-xl font-semibold text-white truncate flex items-center gap-2">
          <span className="text-blue-400">#</span>
          {editedTask?.title || "Untitled Task"}
        </h2>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-white transition-all duration-150 transform hover:scale-110 hover:rotate-90 flex items-center"
          aria-label="Close drawer"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 pt-3 space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400 w-[140px] flex-shrink-0">
            <Text size={16} />
            <label
              htmlFor="title"
              className="uppercase tracking-wide font-semibold text-xs select-none"
            >
              Title
            </label>
          </div>
          <input
            id="title"
            name="title"
            value={editedTask?.title || ""}
            onChange={handleAutoSaveChange}
            className="flex-1 text-white py-2 bg-transparent border-none outline-none text-l font-medium rounded-lg px-4 
              placeholder-gray-500 hover:bg-gray-700 transition-all"
            placeholder="Enter task title"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 py-1 text-gray-400 w-[140px] flex-shrink-0">
              <CheckSquare size={16} />
              <label
                htmlFor="status"
                className="uppercase tracking-wide font-semibold text-xs select-none"
              >
                Status
              </label>
            </div>
            <div className="relative" ref={badgeDropdownRef}>
              <div
                className="cursor-pointer px-2 py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownType(dropdownType === "status" ? null : "status");
                }}
              >
                <BadgeLabel type="status" value={editedTask?.status || ""} className="text-base px-4 py-1.5 font-semibold"/>
              </div>
              {dropdownType === "status" && (
                <div
                  className="absolute left-0 top-full mt-1 bg-[#1f2937] border border-gray-700 rounded shadow-md p-1 min-w-max z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {["pending", "in-progress", "completed"].map((option) => (
                    <div
                      key={option}
                      onClick={() => handleBadgeSelect("status", option)}
                      className="px-2 py-1 hover:bg-gray-600 cursor-pointer rounded"
                    >
                      <BadgeLabel type="status" value={option} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 py-1 text-gray-400 w-[140px] flex-shrink-0">
              <Flag size={16} />
              <label
                htmlFor="priority"
                className="uppercase tracking-wide font-semibold text-xs select-none"
              >
                Priority
              </label>
            </div>
            <div className="relative" ref={badgeDropdownRef} >
              <div
                className="cursor-pointer px-2 py-1 mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownType(dropdownType === "priority" ? null : "priority");
                }}
              >
                <BadgeLabel
                  type="priority"
                  value={editedTask?.priority || ""}
                  className="text-base px-4 py-1.5 font-semibold"
                />
              </div>
              {dropdownType === "priority" && (
                <div
                  className="absolute left-0 top-full mt-1 bg-[#1f2937] border border-gray-700 rounded shadow-md p-1 min-w-max z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {["high", "mid", "low"].map((option) => (
                    <div
                      key={option}
                      onClick={() => handleBadgeSelect("priority", option)}
                      className="px-2 py-1 hover:bg-gray-600 cursor-pointer rounded"
                    >
                      <BadgeLabel type="priority" value={option} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400 w-[140px] flex-shrink-0">
            <Calendar size={16} />
            <label
              htmlFor="due_date"
              className="uppercase py-1 tracking-wide font-semibold text-xs select-none"
            >
              Due Date
            </label>
          </div>
          <input
            id="due_date"
            name="due_date"
            type="date"
            value={
              editedTask?.due_date
                ? new Date(editedTask.due_date).toISOString().split("T")[0]
                : ""
            }
            onChange={handleAutoSaveChange}
            className="flex-1 bg-transparent text-white rounded-lg px-4 py-1 
              focus:outline-none
              transition-all  border-none"
          />
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center gap-2 text-gray-400 w-[140px] flex-shrink-0 mt-1">
            <User size={16} />
            <label className="uppercase tracking-wide font-semibold text-xs select-none">
              Assignees
            </label>
          </div>
          <div className="flex-1 relative">
            <div className="flex flex-wrap gap-2 mb-2 px-1 transition-all duration-300">
              {(editedTask.assignees || []).map((assignee) => (
                <div
                  key={assignee.id}
                  className={`group inline-flex items-center justify-center h-7 px-4 bg-[#1b319e] text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out transform ${
                    newlyAddedAssigneeIds.includes(assignee.id) ? "fade-in" : ""
                  }`}
                  style={{
                    transitionProperty: "background, color, opacity, transform",
                  }}
                >
                  <div className="relative flex items-center justify-center group">
                    <span className="text-white transition-opacity duration-200 group-hover:opacity-60 whitespace-nowrap">
                      {assignee.name}
                    </span>
                    <button
                      className="absolute inset-0 m-auto w-4 h-4 flex items-center justify-center text-white bg-red-600 hover:bg-red-700 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                      title="Remove"
                      onClick={() => handleRemoveAssignee(assignee.id)}
                    >
                      −
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={async () => {
                  try {
                    const members = await getAllWorkspaceMembers(
                      task.workspace_id
                    );
                    const currentAssigneeIds = new Set(
                      (editedTask.assignees || []).map((a) => a.user_id)
                    );
                    const unassignedMembers = members.filter(
                      (member) => !currentAssigneeIds.has(member.user_id)
                    );
                    setDropdownMembers(unassignedMembers);
                    setShowAssigneeDropdown((prev) => !prev);
                  } catch (err) {
                    console.error("Error fetching members:", err);
                  }
                }}
                className="h-7 w-7 rounded-full bg-gray-700 hover:bg-gray-600 
                  text-white flex items-center justify-center text-sm
                  transition-all duration-200 hover:scale-110 shadow-md"
              >
                +
              </button>
            </div>
            {showAssigneeDropdown && (
              <div
                className="absolute top-full left-0 mt-2 w-56 bg-[#1e293b] text-white 
                rounded-lg shadow-xl border border-gray-700 z-50 max-h-48 overflow-y-auto
                backdrop-blur-sm bg-opacity-95"
              >
                {dropdownMembers?.map((member) => (
                  <div
                    key={member.id}
                    onClick={() =>
                      handleAssign(editedTask.id, [member.user_id])
                    }
                    className="px-4 py-2.5 hover:bg-blue-600/50 cursor-pointer text-sm
                      transition-colors duration-200 flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    {member.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center gap-2 text-gray-400 w-[140px] flex-shrink-0 mt-1">
            <User size={16} />
            <label className="uppercase tracking-wide font-semibold text-xs select-none">
              Created By
            </label>
          </div>
          <div className="flex-1">
            <p className="text-white font-medium px-4">
              {task.created_by_name || "—"}
            </p>
          </div>
        </div>

        {/* Task Description */}
        {/* <div className="flex items-start gap-4">
          <div className="flex items-center gap-2 text-gray-400 w-[140px] flex-shrink-0">
            <AlignLeft size={16} />
            <label htmlFor="description" className="uppercase tracking-wide font-semibold text-xs select-none">
              Description
            </label>
          </div>
          <textarea
            id="description"
            name="description"
            value={editedTask?.description || ''}
            onChange={handleAutoSaveChange}
            className="flex-1 text-white bg-transparent border-none outline-none text-l font-medium rounded-lg px-4 
              placeholder-gray-500 transition-all resize-none"
            placeholder="Enter the description"
          />
        </div> */}

        <div>
          <NotesEditor
            className=""
            initialContent={notes}
            onUpdate={(newContent) => handleNotesUpdate(newContent)}
          />
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .task-details-enter {
          animation: slideIn 0.3s ease-out;
        }

        .fade-in {
          animation: fadeInScale 0.4s ease-out;
        }

        .hover-lift {
          transition: transform 0.2s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

export default TaskDetails;
