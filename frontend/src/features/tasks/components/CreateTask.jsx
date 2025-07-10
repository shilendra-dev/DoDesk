import {X, Text, AlignLeft, Flag, CheckSquare, Calendar, PlusCircle,} from "lucide-react";
import axios from "axios";
import FormField from "../../../shared/components/molecules/FormField";
import HeadlessButton from "../../../shared/components/atoms/headlessUI/HeadlessButton";
import { useForm } from 'react-hook-form';
import { priorityOptions, statusOptions } from "../constants/taskOptions";

function CreateTask({ isOpen, onClose, onTaskCreated, workspaceId }) {

  // State to manage form data - react-hook-form will handle this
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
        title: "",
        description: "",
        status: "pending",
        priority: "mid",
        due_date: "",
    }
  });

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `http://localhost:5033/api/workspaces/${workspaceId}/task`,
        {
          ...data,
          workspace_id: workspaceId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onTaskCreated(res.data.task);
      reset(); // Reset form fields after successful submission
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
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 overflow-y-auto p-6 pt-3 space-y-6"
      >
        <FormField
          label="Title"
          name="title"
          variant="secondary"
          className="w-full"
          type="text"
          placeholder="Enter task title"
          {...register("title", { required: "Title is required" })}
          icon={Text}
        />
        <div className="flex flex-col gap-4">
          <FormField
            label="Status"
            name="status"
            type="select"
            icon={CheckSquare}
            options={statusOptions}
            {...register("status")}
          />

          <FormField
            label="Priority"
            name="priority"
            type="select"
            icon={Flag}
            options={priorityOptions}
            {...register("priority")}
          />
        </div>

        <FormField
          label="Due Date"
          name="due_date"
          variant="secondary"
          type="date"
          icon={Calendar}
          className="cursor-pointer"
          {...register("due_date")}
        />

        <FormField
          label="Description"
          name="description"
          variant="ghost"
          placeholder="Enter task description..."
          type="textarea"
          rows={4}
          icon={AlignLeft}
          {...register("description")}
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
