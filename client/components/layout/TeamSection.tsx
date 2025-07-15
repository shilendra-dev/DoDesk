'use client'

import React from 'react'
import { TeamDropdown } from './TeamDropdown'

interface Team {
    id: string
    name: string
    color: string
}

interface TeamsSectionProps {
    teams: Team[]
    onNavigate: (path: string) => void
    expandedTeams: Set<string>
    onToggleTeam: (teamId: string) => void
}

export function TeamsSection({ teams, onNavigate, expandedTeams, onToggleTeam }: TeamsSectionProps) {

    const toggleTeam = (teamId: string) => {
        onToggleTeam(teamId)
    }

    return (
        <div className="space-y-1">
            {teams.map((team) => (
                <TeamDropdown
                    key={team.id}
                    name={team.name}
                    color={team.color}
                    isExpanded={expandedTeams.has(team.id)}
                    onNavigate={(path) => onNavigate(`${team.id}/${path}`)}
                    onToggle={() => toggleTeam(team.id)}
                />
            ))}
        </div>
    )
}