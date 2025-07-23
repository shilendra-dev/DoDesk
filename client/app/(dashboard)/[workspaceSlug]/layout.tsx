"use client"

import { useSession } from "next-auth/react"
import { useWorkspaceStore } from "@/stores/workspaceStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { use } from "react"

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ workspaceSlug: string }>;
}

export default function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  const { status } = useSession()
  const { currentWorkspace, isLoading, hasWorkspaces, workspaces, lastActiveWorkspaceId, setCurrentWorkspaceBySlug } = useWorkspaceStore()
  const router = useRouter()
  const resolvedParams = use(params)
  const workspaceSlug = resolvedParams.workspaceSlug

  // 1. Set workspace by slug whenever slug or workspaces change
  useEffect(() => {
    if (workspaces.length > 0) {
      setCurrentWorkspaceBySlug(workspaceSlug)
    }
  }, [workspaceSlug, workspaces.length])

  // 2. Redirect if slug is invalid
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin')
      return
    }
    if (!isLoading && status === 'authenticated' && workspaces.length > 0) {
      if (!hasWorkspaces) {
        router.replace('/onboarding')
        return
      }
      if (!currentWorkspace) {
        // Invalid slug, redirect to last active workspace
        const lastActiveWorkspace = workspaces.find(w => w.id === lastActiveWorkspaceId)
        if (lastActiveWorkspace) {
          router.replace(`/${lastActiveWorkspace.slug}/myissues`)
        } else {
          router.replace('/onboarding')
        }
      }
    }
  }, [status, isLoading, hasWorkspaces, currentWorkspace, workspaces, lastActiveWorkspaceId, router])

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    )
  }

  if (status === 'unauthenticated' || !currentWorkspace) {
    return null
  }

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