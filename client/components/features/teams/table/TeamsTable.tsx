'use client'

import React from 'react'
import { Team } from '@/types/workspace'
import { TeamsDataTable } from './TeamsDataTable'
import { TeamsColumns } from './TeamsColumn'

interface TeamsTableProps {
  teams: Team[]
  isLoading?: boolean
  onEditTeam?: (team: Team) => void
  onDeleteTeam?: (team: Team) => void
  onManageMembers?: (team: Team) => void
}

export function TeamsTable({ 
  teams, 
  isLoading = false,
  onEditTeam,
  onDeleteTeam,
  onManageMembers
}: TeamsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-muted animate-pulse rounded" />
        ))}
      </div>
    )
  }

  return (
    <TeamsDataTable
      columns={TeamsColumns}
      data={teams}
      searchKey="name"
      searchPlaceholder="Search teams..."
      showSearch={false}
      emptyMessage="No teams found. Create your first team to get started."
      className="w-full"
    />
  )
}