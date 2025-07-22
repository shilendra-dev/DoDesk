import { create } from 'zustand'
import { Workspace, Team, TeamMember } from '@/types/workspace'
import api from '@/lib/axios'

interface WorkspaceStoreState {
  workspaces: Workspace[]
  currentWorkspace: Workspace | null
  defaultWorkspaceId: string | null
  lastActiveWorkspaceId: string | null
  isLoading: boolean
  hasWorkspaces: boolean
  teams: Team[]
  members: TeamMember[]
  // Actions
  fetchWorkspaces: () => Promise<void>
  fetchTeams: () => Promise<void>
  fetchMembers: () => Promise<void>
  switchWorkspace: (slug: string) => Promise<void>
  addWorkspace: (workspace: Workspace) => Promise<void>
  updateDefaultWorkspace: (workspaceId: string) => Promise<void>
  getDefaultWorkspace: () => Workspace | null
  getWorkspaceBySlug: (slug: string) => Workspace | null
  setCurrentWorkspaceBySlug: (slug: string) => void
}

export const useWorkspaceStore = create<WorkspaceStoreState>((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  defaultWorkspaceId: null,
  lastActiveWorkspaceId: null,
  isLoading: true,
  hasWorkspaces: false,
  teams: [],
  members: [],

  fetchWorkspaces: async () => {
    set({ isLoading: true })
    try {
      const [userResponse, workspacesResponse] = await Promise.all([
        api.get('/api/user'),
        api.get('/api/workspaces?include=teams,members')
      ])
      const workspaces: Workspace[] = workspacesResponse.data.workspaces || []
      const defaultWorkspaceId = userResponse.data.user.default_workspace_id
      const lastActiveWorkspaceId = userResponse.data.user.lastActiveWorkspaceId || null

      // Set current workspace based on last active or default
      let current: Workspace | null = null
      if (lastActiveWorkspaceId) {
        current = workspaces.find(w => w.id === lastActiveWorkspaceId) || null
      } else if (defaultWorkspaceId) {
        current = workspaces.find(w => w.id === defaultWorkspaceId) || null
      } else if (workspaces.length > 0) {
        current = workspaces[0]
      }

      set({
        workspaces,
        defaultWorkspaceId,
        lastActiveWorkspaceId,
        currentWorkspace: current,
        hasWorkspaces: workspaces.length > 0,
        teams: current?.teams || [],
        members: current?.teams.flatMap(t => t.members) || [],
        isLoading: false
      })
    } catch (error) {
      set({
        workspaces: [],
        defaultWorkspaceId: null,
        lastActiveWorkspaceId: null,
        currentWorkspace: null,
        hasWorkspaces: false,
        teams: [],
        members: [],
        isLoading: false
      })
      console.error('Failed to fetch workspaces:', error)
    }
  },

  fetchTeams: async () => {
    const currentWorkspace = get().currentWorkspace
    if (!currentWorkspace) return
    try {
      const res = await api.get(`/api/workspaces/${currentWorkspace.id}/teams?include=members`)
      set({
        teams: res.data.teams || [],
        members: res.data.teams?.flatMap((t: Team) => t.members) || []
      })
    } catch (error) {
      set({ teams: [], members: [] })
      console.error('Failed to fetch teams:', error)
    }
  },

  fetchMembers: async () => {
    const currentWorkspace = get().currentWorkspace
    if (!currentWorkspace) return
    try {
      const res = await api.get(`/api/workspaces/${currentWorkspace.id}/members`)
      set({ members: res.data.members || [] })
    } catch (error) {
      set({ members: [] })
      console.error('Failed to fetch members:', error)
    }
  },

  switchWorkspace: async (slug: string) => {
    const workspace = get().getWorkspaceBySlug(slug)
    if (workspace) {
      try {
        await api.post('/api/user/set-last-active-workspace', { workspace_id: workspace.id })
        set({
          currentWorkspace: workspace,
          lastActiveWorkspaceId: workspace.id,
          teams: workspace.teams || [],
          members: workspace.teams?.flatMap(t => t.members) || []
        })
      } catch (error) {
        console.error('Failed to switch workspace:', error)
      }
    }
  },

  addWorkspace: async (workspace: Workspace) => {
    set(state => {
      const exists = state.workspaces.some(w => w.id === workspace.id)
      if (exists) return state
      return { workspaces: [...state.workspaces, workspace] }
    })
    if (!get().defaultWorkspaceId) {
      set({ defaultWorkspaceId: workspace.id })
      try {
        await api.post('/api/user/set-default-workspace', { workspace_id: workspace.id })
      } catch (error) {
        console.error('Failed to set default workspace:', error)
      }
    }
  },

  updateDefaultWorkspace: async (workspaceId: string) => {
    set({ defaultWorkspaceId: workspaceId })
    try {
      await api.post('/api/user/set-default-workspace', { workspace_id: workspaceId })
    } catch (error) {
      console.error('Failed to update default workspace:', error)
    }
  },

  getDefaultWorkspace: () => {
    const { workspaces, defaultWorkspaceId } = get()
    if (!defaultWorkspaceId) return null
    return workspaces.find(w => w.id === defaultWorkspaceId) || null
  },

  getWorkspaceBySlug: (slug: string) => {
    const { workspaces } = get()
    return workspaces.find(w => w.slug === slug) || null
  },

  setCurrentWorkspaceBySlug: (slug: string) => {
    const workspace = get().getWorkspaceBySlug(slug)
    if (workspace) {
      set({
        currentWorkspace: workspace,
        teams: workspace.teams || [],
        members: workspace.teams?.flatMap(t => t.members) || []
      })
    }
  }
}))