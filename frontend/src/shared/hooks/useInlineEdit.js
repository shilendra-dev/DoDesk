import { useState } from "react";
import { toast } from "react-hot-toast";
import { updateTask } from "../../features/tasks/taskApi";

export function useInlineEdit(tasks, setTasks) {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  // Generic API handler for updating any task field
  const handleTaskFieldUpdate = async (taskId, field, value) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === taskId);
      if (!taskToUpdate) return;

      const updatedTask = {
        ...taskToUpdate,
        [field]: value,
      };

      await updateTask(taskId, updatedTask);
    } catch (err) {
      console.error(`Failed to update task ${field}:`, err);
    }
  };

  // Inline edit handler for task fields
  const handleInlineEdit = async (taskId, field, value) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, [field]: value } : task
      )
    );
    try {
      await handleTaskFieldUpdate(taskId, field, value);
    } catch (error) {
      toast.error("Failed to update task");
      console.error(`Failed to update task ${field}:`, error);
    }
    setEditingTaskId(null);
    setEditingField(null);
  };

  return {
    editingTaskId,
    setEditingTaskId,
    editingField,
    setEditingField,
    editedTitle,
    setEditedTitle,
    handleInlineEdit,
  };
}