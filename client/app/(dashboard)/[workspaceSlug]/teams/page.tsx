'use client'

import React from 'react'
import { WorkspaceTeams } from '@/components/features/teams/WorkspaceTeams'
import { CreateTeamDialog } from '@/components/features/teams/CreateTeamDialog'
import { Team } from '@/types/workspace'

export default function TeamsPage() {
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

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between pl-4 pr-4 pt-2 pb-2 border-b border-border">
        <h1 className="text-lg font-bold text-foreground">Teams</h1>
        
        <CreateTeamDialog />
      </div>
      
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