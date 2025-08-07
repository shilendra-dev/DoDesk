"use client"

import { Team } from "@/types/workspace"
import { useWorkspaceStore } from "@/stores/workspaceStore"

interface TeamMembershipCellProps {
  team: Team
}

export function TeamMembershipCell({ team }: TeamMembershipCellProps) {
  const currentUser = useWorkspaceStore((state) => state.currentUser)
  const currentUserId = currentUser?.id || ""
  
  const getMembershipStatus = (team: Team, currentUserId: string) => {
    if (!currentUserId) return ''
    
    const membership = team.members.find(member => member.userId === currentUserId)
    return membership ? 'Joined' : ''
  }
  
  const status = getMembershipStatus(team, currentUserId)
  
  if (!status) return null
  
  return (
    <span className="text-[13px] bg-muted px-2 py-1 rounded text-muted-foreground">
      {status}
    </span>
  )
}