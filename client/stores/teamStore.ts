import { create } from 'zustand'
import { Team, TeamMember } from '@/types/workspace'
import api from '@/lib/axios'

interface TeamStoreState {
  teams: Team[]
  members: TeamMember[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchTeams: (workspaceId: string) => Promise<void>
  fetchMembers: (teamId: string) => Promise<void>
  addTeam: (workspaceId: string, data: Partial<Team>) => Promise<Team | null>
  updateTeam: (teamId: string, data: Partial<Team>) => Promise<Team | null>
  deleteTeam: (teamId: string) => Promise<void>
}

export const useTeamStore = create<TeamStoreState>((set) => ({
  teams: [],
  members: [],
  isLoading: false,
  error: null,

  fetchTeams: async (workspaceId: string) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get(`/api/workspaces/${workspaceId}/teams?include=members`)
      set({ teams: res.data.teams || [], isLoading: false })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch teams'
      set({ error: message, isLoading: false })
    }
  },

  fetchMembers: async (teamId: string) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get(`/api/teams/${teamId}/members`)
      set({ members: res.data.members || [], isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch members'
      set({ error: message, isLoading: false })
    }
  },

  addTeam: async (workspaceId, data) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post(`/api/workspaces/${workspaceId}/teams`, data)
      set(state => ({ teams: [...state.teams, res.data.team], isLoading: false }))
      return res.data.team
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add team'
      set({ error: message, isLoading: false })
      return null
    }
  },

  updateTeam: async (teamId, data) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.put(`/api/teams/${teamId}`, data)
      set(state => ({
        teams: state.teams.map(team => team.id === teamId ? res.data.team : team),
        isLoading: false
      }))
      return res.data.team
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update team'
      set({ error: message, isLoading: false })
      return null
    }
  },

  deleteTeam: async (teamId) => {
    set({ isLoading: true, error: null })
    try {
      await api.delete(`/api/teams/${teamId}`)
      set(state => ({
        teams: state.teams.filter(team => team.id !== teamId),
        isLoading: false
      }))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete team'
      set({ error: message, isLoading: false })
    }
  }
}))