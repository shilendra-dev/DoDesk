// client/app/(dashboard)/[workspaceSlug]/myissues/page.tsx
'use client'

import React, { use } from 'react'
import { useWorkspace } from '@/providers/WorkspaceContext'

interface MyIssuesPageProps {
  params: Promise<{
    workspaceSlug: string
  }>
}

export default function MyIssuesPage({ params }: MyIssuesPageProps) {
  const { currentWorkspace, isLoading } = useWorkspace()
  const resolvedParams = use(params)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading workspace...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          My Issues
        </h1>
        <p className="text-muted-foreground">
          {currentWorkspace?.name && `in ${currentWorkspace.name}`}
        </p>
      </div>
      
      <div className="flex items-center justify-center min-h-[400px] border-2 border-dashed border-border rounded-lg">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">
            Issue management interface will be implemented here
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Workspace: {resolvedParams.workspaceSlug}
          </p>
        </div>
      </div>
    </div>
  )
}