import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

function TaskEditModal({ isOpen, onClose, task, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    due_date: "",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "pending",
        priority: task.priority || "low",
        due_date: task.due_date ? task.due_date.split("T")[0] : "",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/tasks/${task.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Task deleted successfully!");
      onClose();
      if (onSave) onSave(null); // Let parent refresh tasks
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task.");
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/tasks/${task.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSave(response.data); // Optional: send updated task to parent
      toast.success("Task updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task.");
      // Optionally show an error message
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 ">
      <div className="bg-[#121826] p-6 rounded-xl shadow-md w-[500px]">
        <h2 className="text-xl font-bold mb-4 text-white">Edit Task</h2>

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full mb-3 p-2 rounded-xl bg-gray-800 text-white"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full mb-3 p-2 rounded-xl bg-gray-800 text-white"
        />

        <div className="flex space-x-2 mb-3">
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="flex-1 p-2 rounded-xl bg-gray-800 text-white"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="flex-1 p-2 rounded-xl bg-gray-800 text-white"
          >
            <option value="low">Low</option>
            <option value="mid">Mid</option>
            <option value="high">High</option>
          </select>
        </div>

        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded-xl bg-gray-800 text-white"
        />

        <div className="flex justify-between items-center">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-700 text-white rounded-xl hover:bg-red-500"
          >
            Delete Task
          </button>
          <div className="space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskEditModal;