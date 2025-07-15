'use client'

import { createContext, useContext, useMemo, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'

interface Workspace {
  id: string
  name: string
  slug: string
}

interface WorkspaceContextType {
  currentWorkspace: Workspace | null
  switchWorkspace: (workspaceSlug: string) => void
  getDefaultWorkspace: () => Workspace | null
  getWorkspaceBySlug: (slug: string) => Workspace | null
  isLoading: boolean
  workspaces: Workspace[]
  hasWorkspaces: boolean
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

interface WorkspaceProviderProps {
  children: ReactNode
}

export const WorkspaceProvider: React.FC<WorkspaceProviderProps> = ({ children }) => {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  
  // Extract primitive values for stable dependencies
  const workspaces = session?.user?.workspaces || []
  const workspaceSlug = params.workspaceSlug as string
  const defaultWorkspaceId = session?.user?.default_workspace_id || null
  const isLoading = status === 'loading'

  // Single useMemo for all computed values and functions
  const value = useMemo<WorkspaceContextType>(() => {
    // Helper functions
    const getDefaultWorkspace = (): Workspace | null => {
      if (!defaultWorkspaceId || !workspaces.length) return null
      return workspaces.find(ws => ws.id === defaultWorkspaceId) || null
    }

    const getWorkspaceBySlug = (slug: string): Workspace | null => {
      if (!slug || !workspaces.length) return null
      return workspaces.find(ws => ws.slug === slug) || null
    }

    // Compute current workspace
    let currentWorkspace: Workspace | null = null
    if (workspaceSlug) {
      currentWorkspace = getWorkspaceBySlug(workspaceSlug)
    } else if (!isLoading) {
      currentWorkspace = getDefaultWorkspace()
    }

    // Navigation function
    const switchWorkspace = (slug: string): void => {
      const workspace = getWorkspaceBySlug(slug)
      if (workspace) {
        router.push(`/${slug}/myissues`)
      }
    }

    return {
      currentWorkspace,
      switchWorkspace,
      getDefaultWorkspace,
      getWorkspaceBySlug,
      isLoading,
      workspaces,
      hasWorkspaces: workspaces.length > 0
    }
  }, [workspaces, workspaceSlug, defaultWorkspaceId, isLoading, router])

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export const useWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}