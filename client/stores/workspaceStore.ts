import { create } from 'zustand'
import { Workspace, Team, TeamMember } from '@/types/workspace'
import api from '@/lib/axios'

interface WorkspaceStoreState {
  workspaces: Workspace[]
  currentWorkspace: Workspace | null
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
  getWorkspaceBySlug: (slug: string) => Workspace | null
  setCurrentWorkspaceBySlug: (slug: string) => void
}

export const useWorkspaceStore = create<WorkspaceStoreState>((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
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
      const lastActiveWorkspaceId = userResponse.data.user.lastActiveWorkspaceId || null

      // Set current workspace based on last active, or fallback to first
      let current: Workspace | null = null
      if (lastActiveWorkspaceId) {
        current = workspaces.find(w => w.id === lastActiveWorkspaceId) || null
      } else if (workspaces.length > 0) {
        current = workspaces[0]
      }

      set({
        workspaces,
        lastActiveWorkspaceId,
        currentWorkspace: current,
        hasWorkspaces: workspaces.length > 0,
        teams: current?.teams || [],
        members: current?.teams?.flatMap(t => t.members) || [],
        isLoading: false
      })
    } catch (error) {
      set({
        workspaces: [],
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
      const res = await api.get(`/api/workspace/${currentWorkspace.id}/teams`)
      const teams = res.data.teams || []
      const members = teams.flatMap((t: Team) => t.members || [])
    
      set({
        teams,
        members,
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
      const res = await api.get(`/api/workspace/${currentWorkspace.id}/members`)
      // Transform the backend response to match the expected TeamMember structure
      const backendMembers = res.data.data?.members || []
      const transformedMembers = backendMembers.map((member: { id: string; user_id: string; name?: string; email: string }) => ({
        id: member.id,
        userId: member.user_id,
        role: 'member' as const, // Default role since backend doesn't provide it
        user: {
          id: member.user_id,
          name: member.name,
          email: member.email
        }
      }))
      set({ members: transformedMembers })
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
    try {
      // 1. Add workspace to the list
      set(state => {
        const exists = state.workspaces.some(w => w.id === workspace.id)
        if (exists) return state
        return { workspaces: [...state.workspaces, workspace] }
      })
      
      // 2. Set as current workspace
      const initialMembers = workspace.teams?.flatMap(t => t.members) || []
      
      set({
        currentWorkspace: workspace,
        lastActiveWorkspaceId: workspace.id,
        teams: workspace.teams || [],
        members: initialMembers
      })
      
      // 3. Update user's last active workspace
      try {
        await api.post('/api/user/set-last-active-workspace', { workspace_id: workspace.id })
      } catch (error) {
        console.error('Failed to set last active workspace:', error)
      }
      
    } catch (error) {
      console.error('Error adding workspace:', error)
      throw error
    }
  },

  getWorkspaceBySlug: (slug: string) => {
    const { workspaces } = get()
    return workspaces.find(w => w.slug === slug) || null
  },

  // client/stores/workspaceStore.ts
  setCurrentWorkspaceBySlug: (slug: string) => {
    const workspace = get().workspaces.find(w => w.slug === slug)
    const currentState = get()
    
    // If we're setting the same workspace that's already current, don't reset teams/members
    if (currentState.currentWorkspace?.id === workspace?.id) {
      return // Do nothing - keep existing teams/members
    }
    
    set({
      currentWorkspace: workspace || null,
      teams: workspace?.teams || [],
      members: workspace?.teams?.flatMap(t => t.members) || []
    })
  }
}))