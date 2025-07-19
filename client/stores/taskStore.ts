import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import { Task, CreateTaskData, UpdateTaskData } from '@/types/task'
import { taskService } from '@/services/taskService'
import { toast } from 'react-hot-toast'

// Types
interface TaskState {
  // Normalized state for O(1) lookups
  tasks: Record<string, Task>
  taskIds: string[] // Maintain order
  selectedTaskId: string | null
  selectedTaskDate: Date | null
  
  // Granular loading states
  loadingStates: Record<string, boolean>
  errors: Record<string, string>
  
  // Metadata
  lastFetched: number | null
  isInitialized: boolean
}

interface TaskActions {
  // Core CRUD operations
  fetchTasks: (workspaceId: string) => Promise<void>
  createTask: (taskData: CreateTaskData) => Promise<Task | null>
  updateTask: (taskId: string, updates: UpdateTaskData) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  
  // Assignee operations
  assignTask: (taskId: string, assigneeIds: string[], assigneeName?: string) => Promise<void>
  removeAssignee: (taskId: string, userId: string) => Promise<void>
  
  // Specialized operations
  updateNotes: (taskId: string, notes: string) => Promise<void>
  updateTaskDate: (taskId: string, date: Date | undefined) => Promise<void>
  
  // UI state management
  setSelectedTask: (taskId: string | null) => void
  clearError: (operationId?: string) => void
  
  // Selectors (computed values)
  getTaskById: (taskId: string) => Task | undefined
  getTasksByStatus: (status: string) => Task[]
  getTasksByAssignee: (assigneeId: string) => Task[]
  getTasksArray: () => Task[]
}

type TaskStore = TaskState & TaskActions

// Helper functions
const normalizeTasks = (tasks: Task[]): Record<string, Task> => {
  return tasks.reduce((acc, task) => {
    acc[task.id] = {
      ...task,
      assignees: task.assignees || []
    }
    return acc
  }, {} as Record<string, Task>)
}

const denormalizeTasks = (tasks: Record<string, Task>, taskIds: string[]): Task[] => {
  return taskIds.map(id => tasks[id]).filter(Boolean)
}

// Store implementation
export const useTaskStore = create<TaskStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      tasks: {},
      taskIds: [],
      selectedTaskId: null,
      selectedTaskDate: null,
      loadingStates: {},
      errors: {},
      lastFetched: null,
      isInitialized: false,

      // Core CRUD operations
      fetchTasks: async (workspaceId: string) => {
        const operationId = 'fetchTasks'
        set(state => ({
          loadingStates: { ...state.loadingStates, [operationId]: true },
          errors: { ...state.errors, [operationId]: '' }
        }))

        try {
          const tasks = await taskService.getTasks(workspaceId)
          const normalizedTasks = normalizeTasks(tasks)
          
          set({
            tasks: normalizedTasks,
            taskIds: tasks.map(task => task.id),
            lastFetched: Date.now(),
            isInitialized: true,
            loadingStates: { ...get().loadingStates, [operationId]: false }
          })
        } catch (error) {
          console.error('Error fetching tasks:', error)
          set(state => ({
            errors: { ...state.errors, [operationId]: 'Failed to fetch tasks' },
            loadingStates: { ...state.loadingStates, [operationId]: false }
          }))
          toast.error('Failed to fetch tasks')
        }
      },

      createTask: async (taskData: CreateTaskData) => {
        const operationId = 'createTask'
        set(state => ({
          loadingStates: { ...state.loadingStates, [operationId]: true },
          errors: { ...state.errors, [operationId]: '' }
        }))

        try {
          const newTask = await taskService.createTask(taskData)
          const normalizedTask = { ...newTask, assignees: newTask.assignees || [] }
          
          set(state => ({
            tasks: { ...state.tasks, [newTask.id]: normalizedTask },
            taskIds: [newTask.id, ...state.taskIds],
            loadingStates: { ...state.loadingStates, [operationId]: false }
          }))
          
          toast.success('Task created successfully!')
          return newTask
        } catch (error) {
          console.error('Error creating task:', error)
          set(state => ({
            errors: { ...state.errors, [operationId]: 'Failed to create task' },
            loadingStates: { ...state.loadingStates, [operationId]: false }
          }))
          toast.error('Failed to create task')
          return null
        }
      },

      updateTask: async (taskId: string, updates: UpdateTaskData) => {
        const operationId = `updateTask_${taskId}`
        
        // Filter out null/undefined values
        const validUpdates = Object.fromEntries(
          Object.entries(updates).filter(([, value]) => value != null && value !== '')
        )

        // Check if we can apply optimistic updates
        const canOptimizeUpdate = Object.keys(validUpdates).every(key => 
          ['status', 'priority', 'title', 'due_date'].includes(key)
        )

        if (canOptimizeUpdate) {
          // Optimistic update
          const currentTask = get().tasks[taskId]
          if (!currentTask) return

          set(state => ({
            tasks: {
              ...state.tasks,
              [taskId]: { ...currentTask, ...validUpdates }
            },
            selectedTaskId: state.selectedTaskId === taskId ? taskId : state.selectedTaskId
          }))

          try {
            await taskService.updateTask(taskId, validUpdates)
            //dont need to do anything here, if error occurs it will be handled in the catch block and the optimistic update will be reverted
            
          } catch (error) {
            console.error('Error updating task:', error)
            // Revert optimistic update
            set(state => ({
              tasks: {
                ...state.tasks,
                [taskId]: currentTask
              },
              errors: { ...state.errors, [operationId]: 'Failed to update task' }
            }))
            toast.error('Failed to update task')
          }
        } else {
          // Traditional loading approach for complex updates
          set(state => ({
            loadingStates: { ...state.loadingStates, [operationId]: true },
            errors: { ...state.errors, [operationId]: '' }
          }))

          try {
            const updatedTask = await taskService.updateTask(taskId, validUpdates)
            const currentTask = get().tasks[taskId]
            
            set(state => ({
              tasks: {
                ...state.tasks,
                [taskId]: { ...updatedTask, assignees: currentTask?.assignees || [] }
              },
              loadingStates: { ...state.loadingStates, [operationId]: false }
            }))
          } catch (error) {
            console.error('Error updating task:', error)
            set(state => ({
              errors: { ...state.errors, [operationId]: 'Failed to update task' },
              loadingStates: { ...state.loadingStates, [operationId]: false }
            }))
            toast.error('Failed to update task')
          }
        }
      },

      deleteTask: async (taskId: string) => {
        const operationId = `deleteTask_${taskId}`
        set(state => ({
          loadingStates: { ...state.loadingStates, [operationId]: true },
          errors: { ...state.errors, [operationId]: '' }
        }))

        try {
          await taskService.deleteTask(taskId)
          set(state => ({
            tasks: Object.fromEntries(
              Object.entries(state.tasks).filter(([id]) => id !== taskId)
            ),
            taskIds: state.taskIds.filter(id => id !== taskId),
            selectedTaskId: state.selectedTaskId === taskId ? null : state.selectedTaskId,
            loadingStates: { ...state.loadingStates, [operationId]: false }
          }))
          toast.success('Task deleted successfully!')
        } catch (error) {
          console.error('Error deleting task:', error)
          set(state => ({
            errors: { ...state.errors, [operationId]: 'Failed to delete task' },
            loadingStates: { ...state.loadingStates, [operationId]: false }
          }))
          toast.error('Failed to delete task')
        }
      },

      // Assignee operations with optimistic updates
      assignTask: async (taskId: string, assigneeIds: string[], assigneeName?: string) => {
        const operationId = `assignTask_${taskId}`
        const currentTask = get().tasks[taskId]
        if (!currentTask) return

        // Optimistic update
        const newAssignees = assigneeIds.map(id => ({ id, name: assigneeName || 'Loading...' }))
        const updatedAssignees = [...(currentTask.assignees || []), ...newAssignees]
        
        set(state => ({
          tasks: {
            ...state.tasks,
            [taskId]: { ...currentTask, assignees: updatedAssignees }
          }
        }))

        try {
          await taskService.assignTask(taskId, assigneeIds)
          toast.success('Task assigned successfully!')
        } catch (error) {
          console.error('Error assigning task:', error)
          // Revert optimistic update
          set(state => ({
            tasks: {
              ...state.tasks,
              [taskId]: { 
                ...currentTask, 
                assignees: (currentTask.assignees || []).filter(a => !assigneeIds.includes(a.id))
              }
            },
            errors: { ...state.errors, [operationId]: 'Failed to assign task' }
          }))
          toast.error('Failed to assign task')
        }
      },

      removeAssignee: async (taskId: string, userId: string) => {
        const operationId = `removeAssignee_${taskId}`
        const currentTask = get().tasks[taskId]
        if (!currentTask) return

        // Store original assignees for rollback
        const originalAssignees = [...(currentTask.assignees || [])]

        // Optimistic update
        set(state => ({
          tasks: {
            ...state.tasks,
            [taskId]: {
              ...currentTask,
              assignees: (currentTask.assignees || []).filter(a => a.id !== userId)
            }
          }
        }))

        try {
          await taskService.removeAssignee(taskId, userId)
          toast.success('Assignee removed successfully!')
        } catch (error) {
          console.error('Error removing assignee:', error)
          // Revert optimistic update
          set(state => ({
            tasks: {
              ...state.tasks,
              [taskId]: { ...currentTask, assignees: originalAssignees }
            },
            errors: { ...state.errors, [operationId]: 'Failed to remove assignee' }
          }))
          toast.error('Failed to remove assignee')
        }
      },

      updateNotes: async (taskId: string, notes: string) => {
        const operationId = `updateNotes_${taskId}`
        set(state => ({
          loadingStates: { ...state.loadingStates, [operationId]: true },
          errors: { ...state.errors, [operationId]: '' }
        }))

        try {
          const updatedTask = await taskService.updateNotes(taskId, notes)
          const currentTask = get().tasks[taskId]
          
          set(state => ({
            tasks: {
              ...state.tasks,
              [taskId]: { ...updatedTask, assignees: currentTask?.assignees || [] }
            },
            loadingStates: { ...state.loadingStates, [operationId]: false }
          }))
        } catch (error) {
          console.error('Error updating notes:', error)
          set(state => ({
            errors: { ...state.errors, [operationId]: 'Failed to update notes' },
            loadingStates: { ...state.loadingStates, [operationId]: false }
          }))
          toast.error('Failed to update notes')
        }
      },

      updateTaskDate: async (taskId: string, date: Date | undefined) => {
        const operationId = `updateTaskDate_${taskId}`
        const currentTask = get().tasks[taskId]
        if (!currentTask) return

        // Optimistic update
        const formattedDate = date ? date.toLocaleDateString('en-CA') : undefined
        set(state => ({
          selectedTaskDate: date,
          tasks: {
            ...state.tasks,
            [taskId]: { ...currentTask, due_date: formattedDate }
          }
        }))

        try {
          if (date) {
            await taskService.updateTask(taskId, { due_date: formattedDate })
          } else {
            await taskService.updateTask(taskId, { due_date: '' })
          }
        } catch (error) {
          console.error('Error updating task date:', error)
          // Revert optimistic update
          set(state => ({
            tasks: {
              ...state.tasks,
              [taskId]: currentTask
            },
            errors: { ...state.errors, [operationId]: 'Failed to update task date' }
          }))
          toast.error('Failed to update task date')
        }
      },

      // UI state management
      setSelectedTask: (taskId: string | null) => {
        set({ selectedTaskId: taskId })
      },

      clearError: (operationId?: string) => {
        if (operationId) {
          set(state => ({
            errors: Object.fromEntries(
              Object.entries(state.errors).filter(([key]) => key !== operationId)
            )
          }))
        } else {
          set({ errors: {} })
        }
      },

      // Selectors (computed values)
      getTaskById: (taskId: string) => get().tasks[taskId],

      getTasksByStatus: (status: string) => {
        const { tasks } = get()
        return Object.values(tasks).filter(task => task.status === status)
      },

      getTasksByAssignee: (assigneeId: string) => {
        const { tasks } = get()
        return Object.values(tasks).filter(task => 
          task.assignees?.some(a => a.id === assigneeId)
        )
      },

      getTasksArray: () => {
        const { tasks, taskIds } = get()
        return denormalizeTasks(tasks, taskIds)
      }
    }))
  )
)

// Custom hooks for better performance
export const useTask = (taskId: string) => 
  useTaskStore(state => state.getTaskById(taskId))

export const useTasks = () => 
  useTaskStore(state => state.getTasksArray())

export const useTasksByStatus = (status: string) => 
  useTaskStore(state => state.getTasksByStatus(status))

export const useSelectedTask = () => 
  useTaskStore(state => state.selectedTaskId ? state.getTaskById(state.selectedTaskId) : null)

export const useTaskLoading = (operationId: string) => 
  useTaskStore(state => state.loadingStates[operationId] || false)

export const useTaskError = (operationId: string) => 
  useTaskStore(state => state.errors[operationId] || null)