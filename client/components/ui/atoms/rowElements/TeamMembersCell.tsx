"use client"

import { Team } from "@/types/workspace"
import { Avatar, AvatarFallback } from "@/components/ui/atoms/avatar"

interface TeamMembersCellProps {
  team: Team
}

export function TeamMembersCell({ team }: TeamMembersCellProps) {
  const members = team.members
  const maxDisplay = 3
  const displayMembers = members.slice(0, maxDisplay)
  const remainingCount = members.length - maxDisplay

  if (members.length === 0) {
    return <span className="text-[13px] text-muted-foreground">No members</span>
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex -space-x-2">
        {displayMembers.map((member) => (
          <Avatar key={member.id} className="w-6 h-6 border-2 border-background">
            <AvatarFallback className="text-xs">
              {member.user.name?.[0] || member.user.email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      {remainingCount > 0 && (
        <span className="text-[12px] text-muted-foreground ml-1">
          +{remainingCount}
        </span>
      )}
    </div>
  )
}