'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { useWorkspaceStore } from '@/stores/workspaceStore'

export default function AuthCallback() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const fetchWorkspaces = useWorkspaceStore((state) => state.fetchWorkspaces)

  useEffect(() => {
    const handleCallback = async () => {
      if (isPending) return
      
      if (session) {
        try {
          // Fetch user data and workspaces
          await fetchWorkspaces()
          
          // Get the current state after fetching
          const { lastActiveWorkspaceId, workspaces } = useWorkspaceStore.getState()
          
          // Check if user has lastActiveWorkspace
          if (lastActiveWorkspaceId) {
            // User has a workspace - go directly to dashboard
            const activeWorkspace = workspaces.find(w => w.id === lastActiveWorkspaceId)
            if (activeWorkspace) {
              router.replace(`/${activeWorkspace.slug}/myissues`)
              return
            }
          }
          
          // No lastActiveWorkspace - go to onboarding
          router.replace('/onboarding')
        } catch (error) {
          console.error('Error fetching workspaces:', error)
          // Fallback to onboarding if workspace fetch fails
          router.replace('/onboarding')
        }
      } else {
        // No session - redirect back to signin
        router.replace('/signin')
      }
    }

    handleCallback()
  }, [session, isPending, router, fetchWorkspaces])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  )
}