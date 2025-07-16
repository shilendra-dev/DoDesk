import api from '@/lib/axios'
import { SavedFilter, CreateFilterData } from '@/types/filter'

export const savedFilterService = {
  // Get all saved filters for a workspace
  getSavedFilters: async (workspaceId: string): Promise<SavedFilter[]> => {
    const response = await api.get(`/api/workspaces/${workspaceId}/filters`)
    return response.data.filters || []
  },

  // Create a new saved filter
  createFilter: async (workspaceId: string, filterData: CreateFilterData): Promise<SavedFilter> => {
    const response = await api.post(`/api/workspaces/${workspaceId}/filters`, filterData)
    return response.data.filter
  },

  // Delete a saved filter
  deleteFilter: async (workspaceId: string, filterId: string): Promise<void> => {
    await api.delete(`/api/workspaces/${workspaceId}/filters/${filterId}/remove`)
  },

  // Set a filter as default
  setDefaultFilter: async (workspaceId: string, filterId: string): Promise<SavedFilter> => {
    const response = await api.post(`/api/workspaces/${workspaceId}/filters/${filterId}/default`)
    return response.data.filter
  },

  // Get the default filter
  getDefaultFilter: async (workspaceId: string): Promise<SavedFilter | null> => {
    try {
      const response = await api.get(`/api/workspaces/${workspaceId}/filters/default`)
      return response.data.filter
    } catch (error) {
      console.error('Error getting default filter:', error)
      return null
    }
  }
}   