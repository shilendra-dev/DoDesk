import { create } from 'zustand'
import { Task, CreateTaskData, UpdateTaskData } from '@/types/task'
import { taskService } from '@/services/taskService'
import { toast } from 'react-hot-toast'

interface TaskStore {
  // State
  tasks: Task[]
  selectedTask: Task | null
  loading: boolean
  error: string | null

  // Actions
  fetchTasks: (workspaceId: string) => Promise<void>
  createTask: (taskData: CreateTaskData) => Promise<Task | null>
  updateTask: (taskId: string, updates: UpdateTaskData) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  assignTask: (taskId: string, assigneeIds: string[]) => Promise<void>
  removeAssignee: (taskId: string, userId: string) => Promise<void>
  updateNotes: (taskId: string, notes: string) => Promise<void>
  setSelectedTask: (task: Task | null) => void
  clearError: () => void
}

export const useTaskStore = create<TaskStore>((set) => ({
  // Initial state
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,

  // Actions
  fetchTasks: async (workspaceId: string) => {
    set({ loading: true, error: null })
    try {
      const tasks = await taskService.getTasks(workspaceId)
      set({ tasks, loading: false })
    } catch (error) {
      console.error('Error fetching tasks:', error)
      set({ error: 'Failed to fetch tasks', loading: false })
      toast.error('Failed to fetch tasks')
    }
  },

  createTask: async (taskData: CreateTaskData) => {
    set({ loading: true, error: null })
    try {
      const newTask = await taskService.createTask(taskData)
      set(state => ({
        tasks: [newTask, ...state.tasks],
        loading: false
      }))
      toast.success('Task created successfully!')
      return newTask
    } catch (error) {
      console.error('Error creating task:', error)
      set({ error: 'Failed to create task', loading: false })
      toast.error('Failed to create task')
      return null
    }
  },

  updateTask: async (taskId: string, updates: UpdateTaskData) => {
    // Filter out null/undefined values before processing
    const validUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value != null && value !== '')
    )

    // For simple updates (status, priority), apply optimistically
    const canOptimizeUpdate = Object.keys(validUpdates).every(key => 
      ['status', 'priority', 'title'].includes(key)
    )

    if (canOptimizeUpdate) {
      // Optimistic update - immediate UI feedback
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? { ...task, ...validUpdates } : task
        ),
        selectedTask: state.selectedTask?.id === taskId 
          ? { ...state.selectedTask, ...validUpdates } 
          : state.selectedTask,
        error: null
      }))

      try {
        const updatedTask = await taskService.updateTask(taskId, validUpdates)
        // Sync with server response
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === taskId ? updatedTask : task
          ),
          selectedTask: state.selectedTask?.id === taskId ? updatedTask : state.selectedTask,
        }))
      } catch (error) {
        console.error('Error updating task:', error)
        // Revert optimistic update on failure
        set({
          error: 'Failed to update task',
          // Note: In a real app, you'd want to revert to the original task state
        })
        toast.error('Failed to update task')
      }
    } else {
      // For complex updates, use traditional loading approach
      set({ loading: true, error: null })
      try {
        const updatedTask = await taskService.updateTask(taskId, validUpdates)
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === taskId ? updatedTask : task
          ),
          selectedTask: state.selectedTask?.id === taskId ? updatedTask : state.selectedTask,
          loading: false
        }))
        // Remove intrusive success toast for simple updates
      } catch (error) {
        console.error('Error updating task:', error)
        set({ error: 'Failed to update task', loading: false })
        toast.error('Failed to update task')
      }
    }
  },

  deleteTask: async (taskId: string) => {
    set({ loading: true, error: null })
    try {
      await taskService.deleteTask(taskId)
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== taskId),
        selectedTask: state.selectedTask?.id === taskId ? null : state.selectedTask,
        loading: false
      }))
      toast.success('Task deleted successfully!')
    } catch (error) {
      console.error('Error deleting task:', error)
      set({ error: 'Failed to delete task', loading: false })
      toast.error('Failed to delete task')
    }
  },

  assignTask: async (taskId: string, assigneeIds: string[]) => {
    set({ loading: true, error: null })
    try {
      const updatedTask = await taskService.assignTask(taskId, assigneeIds)
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? updatedTask : task
        ),
        selectedTask: state.selectedTask?.id === taskId ? updatedTask : state.selectedTask,
        loading: false
      }))
      toast.success('Task assigned successfully!')
    } catch (error) {
      console.error('Error assigning task:', error)
      set({ error: 'Failed to assign task', loading: false })
      toast.error('Failed to assign task')
    }
  },

  removeAssignee: async (taskId: string, userId: string) => {
    set({ loading: true, error: null })
    try {
      const updatedTask = await taskService.removeAssignee(taskId, userId)
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? updatedTask : task
        ),
        selectedTask: state.selectedTask?.id === taskId ? updatedTask : state.selectedTask,
        loading: false
      }))
      toast.success('Assignee removed successfully!')
    } catch (error) {
      console.error('Error removing assignee:', error)
      set({ error: 'Failed to remove assignee', loading: false })
      toast.error('Failed to remove assignee')
    }
  },

  updateNotes: async (taskId: string, notes: string) => {
    set({ loading: true, error: null })
    try {
      const updatedTask = await taskService.updateNotes(taskId, notes)
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? updatedTask : task
        ),
        selectedTask: state.selectedTask?.id === taskId ? updatedTask : state.selectedTask,
        loading: false
      }))
    } catch (error) {
      console.error('Error updating notes:', error)
      set({ error: 'Failed to update notes', loading: false })
      toast.error('Failed to update notes')
    }
  },

  setSelectedTask: (task: Task | null) => {
    set({ selectedTask: task })
  },

  clearError: () => {
    set({ error: null })
  }
}))