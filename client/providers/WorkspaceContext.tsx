'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { getDefaultWorkspaceSlug, getWorkspaceBySlug } from '@/lib/workspace-helpers'

export interface Workspace {
  id: string
  name: string
  slug: string
}

interface WorkspaceContextType {
  workspaces: Workspace[]
  currentWorkspace: Workspace | null
  defaultWorkspaceId: string | null
  isLoading: boolean
  hasWorkspaces: boolean
  
  // Actions
  switchWorkspace: (workspaceSlug: string) => void
  addWorkspace: (workspace: Workspace) => void
  updateDefaultWorkspace: (workspaceId: string) => void
  refreshWorkspaces: () => Promise<void>
  
  // Helpers (using workspace-helpers)
  getDefaultWorkspace: () => Workspace | null
  getWorkspaceBySlug: (slug: string) => Workspace | null
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { status } = useSession()
  const params = useParams()
  const router = useRouter()
  
  // State - no more session dependency
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [defaultWorkspaceId, setDefaultWorkspaceId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true) // Start with loading true
  const [hasInitialized, setHasInitialized] = useState(false) // Track if we've fetched once
  
  const workspaceSlug = params.workspaceSlug as string
  const isAuthenticated = status === 'authenticated'

  // Fetch workspaces from backend
  const fetchWorkspaces = async () => {
    if (!isAuthenticated) return
    
    setIsLoading(true)
    try {
      // Use existing backend endpoints
      const [userResponse, workspacesResponse] = await Promise.all([
        api.get('/api/user'), 
        api.get(`/api/workspaces`)
      ])
      
      setWorkspaces(workspacesResponse.data.workspaces || [])
      setDefaultWorkspaceId(userResponse.data.user.default_workspace_id)
    } catch (error) {
      console.error('Failed to fetch workspaces:', error)
      setWorkspaces([])
      setDefaultWorkspaceId(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch and loading state management - only fetch once per session
  useEffect(() => {
    if (status === 'loading') {
      // Session is still loading, keep loading state
      setIsLoading(true)
    } else if (isAuthenticated && !hasInitialized) {
      fetchWorkspaces()
      setHasInitialized(true)
    } else if (status === 'unauthenticated') {
      // Not authenticated, stop loading and reset
      setIsLoading(false)
      setHasInitialized(false)
    }
  }, [isAuthenticated, status, hasInitialized])

  // Helper functions using workspace-helpers
  const getDefaultWorkspace = (): Workspace | null => {
    const defaultSlug = getDefaultWorkspaceSlug(workspaces, defaultWorkspaceId)
    return defaultSlug ? getWorkspaceBySlug(workspaces, defaultSlug) : null
  }

  const getWorkspaceBySlugHelper = (slug: string): Workspace | null => {
    return getWorkspaceBySlug(workspaces, slug)
  }

  // Current workspace logic
  let currentWorkspace: Workspace | null = null
  if (workspaceSlug) {
    currentWorkspace = getWorkspaceBySlugHelper(workspaceSlug)
  } else if (!isLoading) {
    currentWorkspace = getDefaultWorkspace()
  }

  // Actions
  const switchWorkspace = (slug: string): void => {
    const workspace = getWorkspaceBySlugHelper(slug)
    if (workspace) {
      router.push(`/${slug}/myissues`)
    }
  }

  const addWorkspace = async (workspace: Workspace): Promise<void> => {
    setWorkspaces(prev => {
      const exists = prev.some(w => w.id === workspace.id)
      if (exists) return prev
      return [...prev, workspace]
    })
    
    // Set as default if user has no default
    if (!defaultWorkspaceId) {
      setDefaultWorkspaceId(workspace.id)
      try {
        await api.post('/api/user/set-default-workspace', { workspace_id: workspace.id })
      } catch (error) {
        console.error('Failed to set default workspace:', error)
      }
    }
  }

  const updateDefaultWorkspace = async (workspaceId: string): Promise<void> => {
    setDefaultWorkspaceId(workspaceId)
    try {
      await api.post('/api/user/set-default-workspace', { workspace_id: workspaceId })
    } catch (error) {
      console.error('Failed to update default workspace:', error)
    }
  }

  const value: WorkspaceContextType = {
    workspaces,
    currentWorkspace,
    defaultWorkspaceId,
    isLoading,
    hasWorkspaces: workspaces.length > 0,
    switchWorkspace,
    addWorkspace,
    updateDefaultWorkspace,
    refreshWorkspaces: fetchWorkspaces,
    getDefaultWorkspace,
    getWorkspaceBySlug: getWorkspaceBySlugHelper
  }

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}