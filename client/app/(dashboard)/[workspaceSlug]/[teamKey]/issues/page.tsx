'use client'

import React, { useEffect, useState } from 'react'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { useIssueStore } from '@/stores/issueStore'
import { IssueListView } from '@/components/features/issues/IssueListView'
import { IssueBoardView } from '@/components/features/issues/IssueBoardView'
import { IssueDetails } from '@/components/features/issues/IssueDetails'
// import { CreateIssueButton } from '@/components/features/issues/CreateIssueButton'
// import { ViewToggle } from '@/components/features/issues/ViewToggle'
import { LoadingSpinner } from '@/components/ui/atoms/loading-spinner'
import { use } from 'react'
import { ViewHeader } from '@/components/ui/organisms/ViewHeader'
import { Users } from 'lucide-react'

interface TeamIssuesPageProps {
  params: Promise<{
    workspaceSlug: string
    teamKey: string
  }>
}

export default function TeamIssuesPage({ params }: TeamIssuesPageProps) {
  const { teamKey } = use(params)
  const { currentWorkspace, isLoading } = useWorkspaceStore()
  const { issues, loadingStates, selectedIssueId, fetchIssuesByWorkspace, setSelectedIssue } = useIssueStore()

  // Local UI state for view and create modal
  const [view, setView] = useState<'list' | 'board'>('list')
  const [showCreateIssue, setShowCreateIssue] = useState(false)

  // Find the current team
  const currentTeam = currentWorkspace?.teams.find(team => team.key === teamKey)

  // Fetch issues when workspace changes
  useEffect(() => {
    if (currentWorkspace?.id) {
      fetchIssuesByWorkspace(currentWorkspace.id)
    }
  }, [currentWorkspace?.id, fetchIssuesByWorkspace])

  // If team doesn't exist, show error or redirect
  if (!currentTeam) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Team not found</p>
        </div>
      </div>
    )
  }

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
      <ViewHeader
        title={`${currentTeam.name} Issues`}
        icon={<Users size={20} className="text-muted-foreground" />}
        color={currentTeam.color}
        showViewToggle={true}
        view={view}
        setView={setView}
        showCreateIssue={showCreateIssue}
        setShowCreateIssue={setShowCreateIssue}
        workspaceId={currentWorkspace?.id}
      />
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