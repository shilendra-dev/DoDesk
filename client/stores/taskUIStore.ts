import { create } from 'zustand'
import { TaskView } from '@/types/task'

interface TaskUIStore {
  // State
  view: TaskView
  showCreateTask: boolean
  showTaskDetails: boolean
  editingTaskId: string | null
  editingField: string | null

  // Actions
  setView: (view: TaskView) => void
  setShowCreateTask: (show: boolean) => void
  setShowTaskDetails: (show: boolean) => void
  setEditingTask: (taskId: string | null, field?: string | null) => void
  resetEditing: () => void
}

export const useTaskUIStore = create<TaskUIStore>((set) => ({
  // Initial state
  view: 'list',
  showCreateTask: false,
  showTaskDetails: false,
  editingTaskId: null,
  editingField: null,

  // Actions
  setView: (view: TaskView) => set({ view }),
  setShowCreateTask: (show: boolean) => set({ showCreateTask: show }),
  setShowTaskDetails: (show: boolean) => set({ showTaskDetails: show }),
  setEditingTask: (taskId: string | null, field: string | null = null) => 
    set({ editingTaskId: taskId, editingField: field }),
  resetEditing: () => set({ editingTaskId: null, editingField: null })
}))