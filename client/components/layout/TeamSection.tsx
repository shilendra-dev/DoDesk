'use client'

import React from 'react'
import { TeamDropdown } from './TeamDropdown'
import { usePathname } from 'next/navigation'

interface Team {
    id: string
    name: string
    color: string
    key: string
}

interface TeamsSectionProps {
    teams: Team[]
    onNavigate: (path: string) => void
    expandedTeams: Set<string>
    onToggleTeam: (teamId: string) => void
}

export function TeamsSection({ teams, onNavigate, expandedTeams, onToggleTeam }: TeamsSectionProps) {
    const pathname = usePathname()
    const toggleTeam = (teamId: string) => {
        onToggleTeam(teamId)
    }

    return (
        <div className="space-y-1">
        {teams.map((team) => {
            // Check if this team's issues page is active
            const isTeamIssuesActive = pathname.includes(`/${team.key}/issues`)
            
            return (
                <TeamDropdown
                    key={team.id}
                    name={team.name}
                    color={team.color}
                    isExpanded={expandedTeams.has(team.id)}
                    onNavigate={(path) => onNavigate(`${team.key}/${path}`)}
                    onToggle={() => toggleTeam(team.id)}
                    isActive={isTeamIssuesActive}
                />
            )
        })}
    </div>
    )
}