'use client'

import React, { useEffect, useState } from 'react'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { useIssueStore } from '@/stores/issueStore'
import { IssueListView } from '@/components/features/issues/IssueListView'
import { IssueBoardView } from '@/components/features/issues/IssueBoardView'
import { IssueDetails } from '@/components/features/issues/IssueDetails'
import { CreateIssueButton } from '@/components/features/issues/CreateIssueButton'
import { ViewToggle } from '@/components/features/issues/ViewToggle'
import { LoadingSpinner } from '@/components/ui/atoms/loading-spinner'

export default function MyIssuesPage() {
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace)
  const isLoading = useWorkspaceStore((state) => state.isLoading)
  const { issues, loadingStates, selectedIssueId, fetchIssuesByWorkspace, setSelectedIssue } = useIssueStore()

  // Local UI state for view and create modal
  const [view, setView] = useState<'list' | 'board'>('list')
  const [showCreateIssue, setShowCreateIssue] = useState(false)

  // Fetch issues when workspace changes
  useEffect(() => {
    if (currentWorkspace?.id) {
      fetchIssuesByWorkspace(currentWorkspace.id)
    }
  }, [currentWorkspace?.id, fetchIssuesByWorkspace])

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
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Issues</h1>
          <p className="text-sm text-muted-foreground">
            {currentWorkspace?.name && `in ${currentWorkspace.name}`}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <ViewToggle view={view} setView={setView} />
          <CreateIssueButton 
            workspaceId={currentWorkspace?.id}
            showCreateIssue={showCreateIssue}
            setShowCreateIssue={setShowCreateIssue}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {view === 'list' ? (
          <IssueListView issues={Object.values(issues)} isLoading={loadingStates.fetchIssuesByWorkspace} />
        ) : (
          <IssueBoardView issues={Object.values(issues)} />
        )}
      </div>

      {/* Issue Details Sidebar */}
      {selectedIssueId && (
        <IssueDetails 
          key={`issue-details-${selectedIssueId}`}
          issueId={selectedIssueId} 
          onClose={() => setSelectedIssue(null)} 
        />
      )}
    </div>
  )
}