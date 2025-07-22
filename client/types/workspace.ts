export interface TeamMember {
    id: string
    userId: string
    role: 'admin' | 'member' | 'viewer'
    user: {
      id: string
      name: string
      email: string
      avatar?: string
    }
  }
  
  export interface Team {
    id: string
    name: string
    key: string
    color: string
    description?: string
    members: TeamMember[]
  }
  
  export interface Workspace {
    id: string
    name: string
    slug: string
    description?: string
    teams: Team[]
}

export interface WorkspaceContextType {
    workspaces: Workspace[]
    currentWorkspace: Workspace | null
    defaultWorkspaceId: string | null
    lastActiveWorkspaceId: string | null
    isLoading: boolean
    hasWorkspaces: boolean
  
    // Teams and members for current workspace
    teams: Team[]
    members: TeamMember[]
  
    // Actions
    switchWorkspace: (workspaceSlug: string) => void
    addWorkspace: (workspace: Workspace) => void
    updateDefaultWorkspace: (workspaceId: string) => void
    refreshWorkspaces: () => Promise<void>
    refreshTeams: () => Promise<void>
    refreshMembers: () => Promise<void>
    getDefaultWorkspace: () => Workspace | null
    getWorkspaceBySlug: (slug: string) => Workspace | null
  }