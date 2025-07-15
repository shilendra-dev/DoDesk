import { Session } from 'next-auth'

export const getDefaultWorkspaceSlug = (session: Session | null): string | null => {
  if (!session?.user?.default_workspace_id || !session?.user?.workspaces) {
    return null
  }
  
  const defaultWorkspace = session.user.workspaces.find(
    ws => ws.id === session.user.default_workspace_id
  )
  
  return defaultWorkspace?.slug || null
}

export const getWorkspaceRedirectUrl = (session: Session | null): string => {
  const defaultSlug = getDefaultWorkspaceSlug(session)
  return defaultSlug ? `/${defaultSlug}/myissues` : '/onboarding'
}

export const validateWorkspaceAccess = (
  session: Session | null, 
  workspaceSlug: string
): boolean => {
  if (!session?.user?.workspaces) return false
  return session.user.workspaces.some(ws => ws.slug === workspaceSlug)
}