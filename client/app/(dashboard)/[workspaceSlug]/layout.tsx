"use client"

import { useSession } from "@/lib/auth-client"
import { useWorkspaceStore } from "@/stores/workspaceStore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { use } from "react"

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ workspaceSlug: string }>;
}

export default function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  const { data: session, isPending } = useSession()
  const { 
    currentWorkspace, 
    isLoading, 
    hasWorkspaces, 
    workspaces, 
    lastActiveWorkspaceId, 
    setCurrentWorkspaceBySlug,
    fetchWorkspaces 
  } = useWorkspaceStore()
  const router = useRouter()
  const resolvedParams = use(params)
  const workspaceSlug = resolvedParams.workspaceSlug
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Fetch workspaces when user is authenticated and workspaces not loaded
  useEffect(() => {
    if (session && !isLoading && workspaces.length === 0) {
      fetchWorkspaces()
    }
  }, [session, isLoading, workspaces.length, fetchWorkspaces])

  // Set current workspace by slug when workspaces are loaded
  useEffect(() => {
    if (workspaces.length > 0) {
      setCurrentWorkspaceBySlug(workspaceSlug)
    }
  }, [workspaceSlug, workspaces.length, setCurrentWorkspaceBySlug])

  // Handle routing based on your flow
  useEffect(() => {
    if (isPending || isRedirecting) return // Prevent multiple redirects

    // No session - redirect to signin
    if (!session) {
      setIsRedirecting(true)
      router.replace('/signin')
      return
    }

    // Session exists but workspaces still loading
    if (isLoading) return

    // Session exists and workspaces loaded
    if (session && !isLoading) {
      // Check if user has any workspaces
      if (!hasWorkspaces) {
        setIsRedirecting(true)
        router.replace('/onboarding')
        return
      }

      // User has workspaces, check if current workspace exists
      if (!currentWorkspace) {
        setIsRedirecting(true)
        // Invalid workspace slug - redirect to last active workspace
        const lastActiveWorkspace = workspaces.find(w => w.id === lastActiveWorkspaceId)
        if (lastActiveWorkspace) {
          router.replace(`/${lastActiveWorkspace.slug}/myissues`)
        } else {
          // No last active workspace - redirect to first workspace
          router.replace(`/${workspaces[0].slug}/myissues`)
        }
        return
      }

      // Valid workspace - render the layout
      // No redirect needed, current workspace is valid
    }
  }, [
    session, 
    isPending, 
    isLoading, 
    hasWorkspaces, 
    currentWorkspace, 
    workspaces, 
    lastActiveWorkspaceId, 
    router,
    isRedirecting
  ])

  // Loading state
  if (isPending || isLoading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">
            {isRedirecting ? 'Redirecting...' : 'Loading workspace...'}
          </p>
        </div>
      </div>
    )
  }

  // Don't render if no session
  if (!session) {
    return null
  }

  // Don't render if no valid workspace (should redirect above, but safety check)
  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Finding your workspace...</p>
        </div>
      </div>
    )
  }

  // Render workspace layout
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-7xl px-2 py-2">
        <div
          className="
            border border-border/60 rounded-lg shadow-2xs
            h-[calc(100vh-24px)]
            overflow-y-auto
            flex flex-col
          "
        >
          {children}
        </div>
      </div>
    </div>
  )
}