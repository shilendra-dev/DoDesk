import axios from "axios";
import { toast } from "react-hot-toast";
import { assignTaskToMembers, removeAssignee, updateTask } from "../taskApi";
import { getAllWorkspaceMembers } from "../../workspace/workspace";

class TaskService {
  constructor(taskContext) {
    this.setTasks = taskContext?.setTasks;
  }

  /**
   * Updates a task field and syncs with backend and state
   */
  async updateTaskField(task, fieldName, value) {
    const updatedTask = { ...task, [fieldName]: value };
    
    try {
      await updateTask(updatedTask.id, updatedTask);
      
      // Update state if available
      if (this.setTasks) {
        this.setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === updatedTask.id ? { ...t, [fieldName]: value } : t
          )
        );
      }
      
      toast.success(`${this._formatFieldName(fieldName)} updated successfully`);
      return updatedTask;
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error);
      toast.error(`Failed to update ${this._formatFieldName(fieldName)}`);
      throw error;
    }
  }

  /**
   * Updates task notes
   */
  async updateTaskNotes(taskId, notes) {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5033/api/task/${taskId}/notes`,
        { notes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating notes:", error);
      toast.error("Failed to update notes");
      throw error;
    }
  }

  /**
   * Assigns members to a task
   */
  async assignMembersToTask(task, assigneeIds) {
    try {
      await assignTaskToMembers(task.id, assigneeIds);

      // Fetch updated task data if workspace_id is available
      let updatedTask = task;
      if (task.workspace_id) {
        const updatedTaskResponse = await axios.get(
          `http://localhost:5033/api/workspace/${task.workspace_id}/tasks`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const updatedTasks = updatedTaskResponse.data.tasks;
        updatedTask = updatedTasks.find((t) => t.id === task.id) || task;
      }

      // Update state if available
      if (this.setTasks) {
        const members = await getAllWorkspaceMembers(task.workspace_id);
        
        this.setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === task.id
              ? {
                  ...t,
                  assignees: [
                    ...(t.assignees || []),
                    ...members
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
      }

      toast.success("Assignee added successfully");
      return { updatedTask, assigneeIds };
    } catch (error) {
      console.error("Failed to assign member:", error);
      if (error.response && error.response.status === 409) {
        toast.error("Member is already assigned");
      } else {
        toast.error("Failed to assign member");
      }
      throw error;
    }
  }

  /**
   * Removes an assignee from a task
   */
  async removeAssigneeFromTask(task, userId) {
    try {
      await removeAssignee(task.id, userId);
      
      const updatedTask = {
        ...task,
        assignees: (task.assignees || []).filter(
          (assignee) => assignee.id !== userId
        ),
      };

      // Update state if available
      if (this.setTasks) {
        this.setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === task.id
              ? {
                  ...t,
                  assignees: (t.assignees || []).filter((a) => a.id !== userId),
                }
              : t
          )
        );
      }

      toast.success("Assignee removed successfully");
      return updatedTask;
    } catch (error) {
      console.error("Failed to remove assignee:", error);
      toast.error("Failed to remove assignee");
      throw error;
    }
  }

  /**
   * Gets available workspace members for assignment
   */
  async getAvailableMembers(workspaceId, currentAssignees = []) {
    try {
      const members = await getAllWorkspaceMembers(workspaceId);
      const currentAssigneeIds = new Set(
        currentAssignees.map((a) => a.user_id)
      );
      return members.filter(
        (member) => !currentAssigneeIds.has(member.user_id)
      );
    } catch (error) {
      console.error("Error fetching members:", error);
      throw error;
    }
  }

  /**
   * Bulk update task fields
   */
  async updateTaskFields(task, fields) {
    const updatedTask = { ...task, ...fields };
    
    try {
      await updateTask(updatedTask.id, updatedTask);
      
      // Update state if available
      if (this.setTasks) {
        this.setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === updatedTask.id ? { ...t, ...fields } : t
          )
        );
      }
      
      return updatedTask;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  /**
   * Helper method to format field names for user messages
   */
  _formatFieldName(fieldName) {
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace('_', ' ');
  }
}

export default TaskService;