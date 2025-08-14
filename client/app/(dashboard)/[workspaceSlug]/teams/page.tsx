'use client'

import React from 'react'
import { WorkspaceTeams } from '@/components/features/teams/WorkspaceTeams'
import { CreateTeamDialog } from '@/components/features/teams/CreateTeamDialog'
import { CommonHeader } from '@/components/layout/CommonHeader'
import { Team } from '@/types/workspace'
import { useWorkspaceStore } from '@/stores/workspaceStore'

export default function TeamsPage() {
  const { fetchTeams } = useWorkspaceStore()

  const handleEditTeam = (team: Team) => {
    // TODO: Implement edit team functionality
    console.log('Edit team:', team)
  }

  const handleDeleteTeam = (team: Team) => {
    // TODO: Implement delete team functionality
    console.log('Delete team:', team)
  }

  const handleManageMembers = (team: Team) => {
    // TODO: Implement manage members functionality
    console.log('Manage members:', team)
  }

  const handleTeamCreated = () => {
    fetchTeams()
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <CommonHeader
        leftContent={
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-muted/50 rounded-full text-xs font-medium text-foreground">
              Teams
            </span>
          </div>
        }
        rightContent={
          <div className="flex items-center gap-1">
            <CreateTeamDialog onTeamCreated={handleTeamCreated} />
          </div>
        }
      />
      
      {/* Main Content */}
      <div className="flex-1">
        <WorkspaceTeams
          onEditTeam={handleEditTeam}
          onDeleteTeam={handleDeleteTeam}
          onManageMembers={handleManageMembers}
        />
      </div>
    </div>
  )
}