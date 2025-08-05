"use client"

import { Team } from "@/types/workspace"
import { Badge } from "@/components/ui/atoms/badge"

interface TeamNameCellProps {
  team: Team
}

export function TeamNameCell({ team }: TeamNameCellProps) {
  return (
    <div className="flex items-center gap-3">
      <div 
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: team.color }}
      />
      <div className="flex items-center gap-2">
        <span className="text-[13.5px] text-foreground font-medium">{team.name}</span>
        <Badge variant="outline" className="font-mono text-xs">
          {team.key}
        </Badge>
      </div>
    </div>
  )
}