import { create } from 'zustand'
import { SavedFilter, CreateFilterData } from '@/types/filter'
import { savedFilterService } from '@/services/savedFilterService'
import { toast } from 'react-hot-toast'

interface SavedFilterStore {
  // State
  savedFilters: SavedFilter[]
  defaultFilter: SavedFilter | null
  selectedViewId: string
  loading: boolean
  error: string | null

  // Actions
  fetchSavedFilters: (workspaceId: string) => Promise<void>
  createFilter: (workspaceId: string, filterData: CreateFilterData) => Promise<SavedFilter | null>
  deleteFilter: (workspaceId: string, filterId: string) => Promise<void>
  setDefaultFilter: (workspaceId: string, filterId: string) => Promise<void>
  setSelectedViewId: (viewId: string) => void
  clearSelectedView: () => void
  clearError: () => void
}

export const useSavedFilterStore = create<SavedFilterStore>((set) => ({
  // Initial state
  savedFilters: [],
  defaultFilter: null,
  selectedViewId: 'none',
  loading: false,
  error: null,

  // Actions
  fetchSavedFilters: async (workspaceId: string) => {
    set({ loading: true, error: null })
    try {
      const [filters, defaultFilter] = await Promise.all([
        savedFilterService.getSavedFilters(workspaceId),
        savedFilterService.getDefaultFilter(workspaceId)
      ])
      set({ 
        savedFilters: filters,
        defaultFilter,
        selectedViewId: defaultFilter?.id || 'none',
        loading: false 
      })
    } catch (error) {
      console.error('Error fetching saved filters:', error)
      set({ error: 'Failed to fetch saved filters', loading: false })
      toast.error('Failed to load saved filters')
    }
  },

  createFilter: async (workspaceId: string, filterData: CreateFilterData) => {
    set({ loading: true, error: null })
    try {
      const newFilter = await savedFilterService.createFilter(workspaceId, filterData)
      set(state => ({
        savedFilters: [...state.savedFilters, newFilter],
        selectedViewId: newFilter.id,
        loading: false
      }))
      toast.success('Filter saved successfully!')
      return newFilter
    } catch (error) {
      console.error('Error creating filter:', error)
      set({ error: 'Failed to create filter', loading: false })
      toast.error('Failed to save filter')
      return null
    }
  },

  deleteFilter: async (workspaceId: string, filterId: string) => {
    set({ loading: true, error: null })
    try {
      await savedFilterService.deleteFilter(workspaceId, filterId)
      set(state => ({
        savedFilters: state.savedFilters.filter(f => f.id !== filterId),
        defaultFilter: state.defaultFilter?.id === filterId ? null : state.defaultFilter,
        selectedViewId: state.selectedViewId === filterId ? 'none' : state.selectedViewId,
        loading: false
      }))
      toast.success('Filter deleted successfully!')
    } catch (error) {
      console.error('Error deleting filter:', error)
      set({ error: 'Failed to delete filter', loading: false })
      toast.error('Failed to delete filter')
    }
  },

  setDefaultFilter: async (workspaceId: string, filterId: string) => {
    set({ loading: true, error: null })
    try {
      const updatedFilter = await savedFilterService.setDefaultFilter(workspaceId, filterId)
      set({
        defaultFilter: updatedFilter,
        selectedViewId: filterId,
        loading: false
      })
      toast.success('Default filter updated!')
    } catch (error) {
      console.error('Error setting default filter:', error)
      set({ error: 'Failed to set default filter', loading: false })
      toast.error('Failed to set default filter')
    }
  },

  setSelectedViewId: (viewId: string) => {
    set({ selectedViewId: viewId })
  },

  clearSelectedView: () => {
    set({ selectedViewId: 'none' })
  },

  clearError: () => {
    set({ error: null })
  }
}))