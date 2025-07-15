"use client"

import { useSession } from "next-auth/react"
import { useWorkspace } from "@/providers/WorkspaceContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { use } from "react"

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    workspaceSlug: string;
  }>;
}

export default function WorkspaceLayout({ 
  children, 
  params 
}: WorkspaceLayoutProps) {
  const { status } = useSession()
  const { currentWorkspace, isLoading, hasWorkspaces, getDefaultWorkspace } = useWorkspace()
  const router = useRouter()
  const resolvedParams = use(params)
  const workspaceSlug = resolvedParams.workspaceSlug

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
      return
    }

    if (!isLoading && status === 'authenticated') {
      if (!hasWorkspaces) {
        // User has no workspaces - go to onboarding
        router.push('/onboarding')
        return
      }

      if (!currentWorkspace) {
        // Invalid workspace slug - redirect to default workspace
        const defaultWorkspace = getDefaultWorkspace()
        if (defaultWorkspace) {
          router.push(`/${defaultWorkspace.slug}/myissues`)
        } else {
          router.push('/onboarding')
        }
        return
      }
    }
  }, [status, isLoading, hasWorkspaces, currentWorkspace, router, workspaceSlug, getDefaultWorkspace])

  // Show loading while checking authentication and workspace
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    )
  }

  // Don't render anything while redirecting
  if (status === 'unauthenticated' || !currentWorkspace) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  )
}