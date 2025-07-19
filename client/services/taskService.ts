import api from '@/lib/axios'
import { Task, CreateTaskData, UpdateTaskData, Assignee } from '@/types/task'

export const taskService = {
  // Get all tasks for a workspace
  getTasks: async (workspaceId: string): Promise<Task[]> => {
    const response = await api.get(`/api/workspace/${workspaceId}/tasks`)
    return response.data.tasks || []
  },

  // Create a new task
  createTask: async (taskData: CreateTaskData): Promise<Task> => {
    const response = await api.post(`/api/workspaces/${taskData.workspace_id}/task`, taskData)
    return response.data.task
  },

  // Update a task
  updateTask: async (taskId: string, taskData: UpdateTaskData): Promise<Task> => {
    // Filter out null/undefined values to prevent database constraint errors
    const filteredData = Object.fromEntries(
      Object.entries(taskData).filter(([, value]) => value != null && value !== '')
    )
    const response = await api.put(`/api/task/${taskId}`, filteredData)
    return response.data.task
  },

  // Delete a task
  deleteTask: async (taskId: string): Promise<void> => {
    await api.delete(`/api/task/${taskId}`)
  },

  // Assign members to a task
  assignTask: async (taskId: string, assigneeIds: string[]): Promise<Task> => {
    const response = await api.post(`/api/task/${taskId}/assign`, { assignees: assigneeIds })
    return response.data.task
  },

  // Remove assignee from task
  removeAssignee: async (taskId: string, userId: string): Promise<Task> => {
    const response = await api.delete(`/api/task/${taskId}/removeAssignee`, {
      data: { userId }
    })
    return response.data.task
  },

  // Update task notes
  updateNotes: async (taskId: string, notes: string): Promise<Task> => {
    const response = await api.put(`/api/task/${taskId}/notes`, { notes })
    return response.data.task
  },

  // Get available members for assignment
  getAvailableMembers: async (workspaceId: string, currentAssignees: Assignee[] = []): Promise<Assignee[]> => {
    const response = await api.get(`/api/workspace/${workspaceId}/members`)
    const allMembers = response.data.members || []
    
    // Transform to use user_id (what backend expects) instead of membership id
    const members = allMembers.map((member: { user_id: string; name: string; email: string }) => ({
      id: member.user_id,  // Backend expects the actual user_id, not membership id
      name: member.name,
      email: member.email
    }))
    
    // Filter out already assigned members
    const assignedIds = currentAssignees.map(a => a.id)
    return members.filter((member: Assignee) => !assignedIds.includes(member.id))
  }
}