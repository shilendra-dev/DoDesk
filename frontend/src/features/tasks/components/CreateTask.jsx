import React, { useState } from "react";
import {
  X,
  Text,
  AlignLeft,
  Flag,
  CheckSquare,
  Calendar,
  PlusCircle,
} from "lucide-react";
import axios from "axios";
import FormField from "../../../shared/components/molecules/FormField";
import HeadlessButton from "../../../shared/components/atoms/headlessUI/HeadlessButton";

function CreateTask({ isOpen, onClose, onTaskCreated, workspaceId }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "mid",
    due_date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `http://localhost:5033/api/workspaces/${workspaceId}/task`,
        {
          ...formData,
          workspace_id: workspaceId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onTaskCreated(res.data.task);
      onClose();
    } catch (error) {
      console.error("Error creating task: ", error);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 w-[480px] max-w-full h-full bg-[var(--color-bg)] border-[0.1px] border-[var(--color-border)] z-70 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } task-details-enter`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b-[0.1px] border-[var(--color-border)] bg-[var(--color-bg-secondary)] backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-xl font-semibold text-[var(--color-text)] truncate flex items-center gap-2">
          <PlusCircle size={20} className="text-[var(--color-text)]" />
          Create Task
        </h2>

        {/* Close drawer button */}
        <button
          onClick={onClose}
          className="text-[var(--color-text-secondary)] hover:text-[var-(--color-text-hover)] transition-all duration-150 transform hover:scale-110 hover:rotate-90 flex items-center cursor-pointer"
          aria-label="Close drawer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto p-6 pt-3 space-y-6"
      >
        <FormField
          label="Title"
          name="title"
          variant="secondary"
          className="w-full"
          type="text"
          placeholder="Enter task title"
          onChange={handleChange}
          required
          icon={Text}
        />
        <div className="flex flex-col gap-4">
          <FormField
            label="Status"
            name="status"
            type="select"
            icon={CheckSquare}
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: "pending", label: "Pending" },
              { value: "in-progress", label: "In Progress" },
              { value: "completed", label: "Completed" },
            ]}
          />

          <FormField
            label="Priority"
            name="priority"
            type="select"
            icon={CheckSquare}
            value={formData.priority}
            onChange={handleChange}
            options={[
              { value: "low", label: "Low" },
              { value: "mid", label: "Mid" },
              { value: "high", label: "High" },
            ]}
          />
        </div>

        <FormField
          label="Due Date"
          name="due_date"
          variant="secondary"
          type="date"
          icon={Calendar}
          value={formData.due_date}
          className="cursor-pointer"
          onChange={handleChange}
        />

        <FormField
          label="Description"
          name="description"
          variant="ghost"
          placeholder="Enter task description..."
          type="textarea"
          rows={4}
          icon={AlignLeft}
          value={formData.description}
          onChange={handleChange}
        />

        <div className="flex justify-end pt-6">
          <HeadlessButton
            type="submit"
            className="w-full px-8 py-3 hover:shadow-lg flex items-center justify-center"
          >
            <PlusCircle size={18} />
            Create Task
          </HeadlessButton>
        </div>
      </form>

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

                .task-details-enter {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
    </div>
  );
}

export default CreateTask;
