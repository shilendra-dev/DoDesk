'use client'

import React, { useEffect, useState } from 'react'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { useIssueStore } from '@/stores/issueStore'
import { IssueListView } from '@/components/features/issues/IssueListView'
import { IssueBoardView } from '@/components/features/issues/IssueBoardView'
import { LoadingSpinner } from '@/components/ui/atoms/loading-spinner'
import { CommonHeader } from '@/components/layout/CommonHeader'
import { ViewToggle } from '@/components/features/issues/ViewToggle'
import { CreateIssueButton } from '@/components/features/issues/CreateIssueButton'
import { use } from 'react'

interface TeamIssuesPageProps {
  params: Promise<{
    workspaceSlug: string
    teamKey: string
  }>
}

export default function TeamIssuesPage({ params }: TeamIssuesPageProps) {
  const { teamKey, workspaceSlug } = use(params)
  const { currentWorkspace, teams, isLoading } = useWorkspaceStore()
  const { issues, loadingStates, fetchIssuesByTeam } = useIssueStore()

  // Local UI state for view and create modal
  const [view, setView] = useState<'list' | 'board'>('list')
  const [showCreateIssue, setShowCreateIssue] = useState(false)

  // Find the current team from the teams array in the store
  const currentTeam = teams.find(team => team.key === teamKey)

  const { fetchTeams, fetchMembers } = useWorkspaceStore()

  // Fetch teams and members when component mounts to ensure we have latest data
  useEffect(() => {
    if (currentWorkspace?.id) {
      fetchTeams()
      fetchMembers()
    }
  }, [currentWorkspace?.id, fetchTeams, fetchMembers])

  // Fetch issues when workspace changes
  useEffect(() => {
    if (currentTeam?.id) {
      fetchIssuesByTeam(currentTeam?.id || '')
    }
  }, [currentTeam?.id, fetchIssuesByTeam])

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

  if (isLoading || loadingStates.fetchIssuesByTeam) {
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
              {currentTeam.name}
            </span>
            <span className="text-xs text-foreground">
              Issues
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
          <IssueListView issues={Object.values(issues)} isLoading={loadingStates.fetchIssuesByTeam} workspaceSlug={workspaceSlug} />
        ) : (
          <IssueBoardView issues={Object.values(issues)} workspaceSlug={workspaceSlug} />
        )}
      </div>
    </div>
  )
}