'use client'

import React from 'react'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { TeamsTable } from './table/TeamsTable'
import { Team } from '@/types/workspace'

interface WorkspaceTeamsProps {
  onEditTeam?: (team: Team) => void
  onDeleteTeam?: (team: Team) => void
  onManageMembers?: (team: Team) => void
}

export function WorkspaceTeams({ 
  onEditTeam,
  onDeleteTeam,
  onManageMembers
}: WorkspaceTeamsProps) {
  const teams = useWorkspaceStore((state) => state.teams)
  const isLoading = useWorkspaceStore((state) => state.isLoading)

  return (
    <TeamsTable
      teams={teams}
      isLoading={isLoading}
      onEditTeam={onEditTeam}
      onDeleteTeam={onDeleteTeam}
      onManageMembers={onManageMembers}
    />
  )
}