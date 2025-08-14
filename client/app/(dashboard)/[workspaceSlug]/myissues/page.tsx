'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { useIssueStore } from '@/stores/issueStore'
import { IssueListView } from '@/components/features/issues/IssueListView'
import { IssueBoardView } from '@/components/features/issues/IssueBoardView'
import { LoadingSpinner } from '@/components/ui/atoms/loading-spinner'
import { CommonHeader } from '@/components/layout/CommonHeader'
import { ViewToggle } from '@/components/features/issues/ViewToggle'
import { CreateIssueButton } from '@/components/features/issues/CreateIssueButton'
import { use } from 'react'

interface MyIssuesPageProps {
  params: Promise<{
    workspaceSlug: string
  }>
}

export default function MyIssuesPage({ params }: MyIssuesPageProps) {
  const { workspaceSlug } = use(params)
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace)
  const currentUser = useWorkspaceStore((state) => state.currentUser)
  const isLoading = useWorkspaceStore((state) => state.isLoading)
  const {issues, loadingStates, fetchIssuesByWorkspace } = useIssueStore()

  // Local UI state for view and create modal
  const [view, setView] = useState<'list' | 'board'>('list')
  const [showCreateIssue, setShowCreateIssue] = useState(false)

  // Fetch issues when workspace changes
  useEffect(() => {
    if (currentWorkspace?.id) {
      fetchIssuesByWorkspace(currentWorkspace.id)
    }
  }, [currentWorkspace?.id, fetchIssuesByWorkspace])

  const myIssues = useMemo(() => {
    if (!currentUser?.id) return []
    return Object.values(issues).filter(issue => issue.assigneeId === currentUser.id)
  }, [currentUser?.id, issues])

  if (isLoading || loadingStates.fetchIssuesByWorkspace) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <CommonHeader
        leftContent={
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-muted/50 rounded-full text-xs font-medium text-foreground">
              My Issues
            </span>
            <span className="text-xs text-foreground">
              Dashboard
            </span>
          </div>
        }
        rightContent={
          <div className="flex items-center gap-1">
            <ViewToggle view={view} setView={setView} />
            <CreateIssueButton 
              workspaceId={currentWorkspace?.id}
              showCreateIssue={showCreateIssue}
              setShowCreateIssue={setShowCreateIssue}
              size="xs"
            />
          </div>
        }
      />

      {/* Main Content */}
      <div className="flex-1">
        {view === 'list' ? (
          <IssueListView issues={myIssues} isLoading={loadingStates.fetchIssuesByWorkspace} workspaceSlug={workspaceSlug} />
        ) : (
          <IssueBoardView issues={myIssues} workspaceSlug={workspaceSlug} />
        )}
      </div>
    </div>
  )
}