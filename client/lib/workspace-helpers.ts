import { Workspace } from "@/types/workspace"

// Updated to work with workspace context data instead of session
export const getDefaultWorkspaceSlug = (
  workspaces: Workspace[], 
  defaultWorkspaceId: string | null
): string | null => {
  if (!defaultWorkspaceId || !workspaces.length) {
    return null
  }
  
  const defaultWorkspace = workspaces.find(ws => ws.id === defaultWorkspaceId)
  return defaultWorkspace?.slug || null
}

export const getWorkspaceRedirectUrl = (
  workspaces: Workspace[], 
  defaultWorkspaceId: string | null
): string => {
  const defaultSlug = getDefaultWorkspaceSlug(workspaces, defaultWorkspaceId)
  return defaultSlug ? `/${defaultSlug}/myissues` : '/onboarding'
}

export const validateWorkspaceAccess = (
  workspaces: Workspace[], 
  workspaceSlug: string
): boolean => {
  if (!workspaces.length) return false
  return workspaces.some(ws => ws.slug === workspaceSlug)
}

// Helper to get workspace by slug
export const getWorkspaceBySlug = (
  workspaces: Workspace[], 
  slug: string
): Workspace | null => {
  if (!slug || !workspaces.length) return null
  return workspaces.find(ws => ws.slug === slug) || null
}