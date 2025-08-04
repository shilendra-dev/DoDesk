"use client"

import { Avatar, AvatarFallback } from "@/components/ui/atoms/avatar"
import { User, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/atoms/dropdown-menu"
import { useWorkspaceStore } from "@/stores/workspaceStore"
import { useIssueStore } from "@/stores/issueStore"
import { useEffect } from "react"

interface Assignee {
  id: string
  name?: string
  email?: string
}

interface AssigneeMenuProps {
  issueId: string
  assignee?: Assignee
}

export function AssigneeMenu({ issueId, assignee }: AssigneeMenuProps) {
  const { members, fetchMembers, currentWorkspace } = useWorkspaceStore()
  const { assignIssue, getIssueById } = useIssueStore()

  // Get the current issue to access assigneeId
  const currentIssue = getIssueById(issueId)

  // Fetch members when component mounts or workspace changes
  useEffect(() => {
    if (currentWorkspace) {
      console.log('Fetching members for workspace:', currentWorkspace.id)
      fetchMembers()
    }
  }, [currentWorkspace, fetchMembers])

  const onAssigneeChange = async (assigneeId: string | null) => {
    try {
      await assignIssue(issueId, assigneeId || '')
    } catch (error) {
      console.error('Failed to change assignee:', error)
    }
  }

  // Check if a member is currently assigned
  const isAssigned = (memberId: string) => {
    // Check both assigneeId and assignee object
    return currentIssue?.assigneeId === memberId || assignee?.id === memberId
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer hover:opacity-80 transition-opacity">
          {assignee ? (
            <Avatar className="w-6 h-6 border-2 border-background">
              <AvatarFallback className="text-xs">
                {assignee.name?.charAt(0).toUpperCase() || assignee.email?.charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
              <User className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit min-w-40 bg-card" align="start">
        <DropdownMenuGroup>
          {members.length > 0 ? (
            members.map((member) => (
              <DropdownMenuItem 
                key={member.userId} 
                onClick={() => onAssigneeChange(member.userId)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Avatar className="w-5 h-5">
                  <AvatarFallback className="text-xs">
                    {member.user.name?.charAt(0).toUpperCase() || member.user.email?.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{member.user.name || member.user.email}</span>
                {isAssigned(member.userId) && (
                  <Check className="h-4 w-4 text-primary ml-auto" />
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled className="text-muted-foreground">
              No members available
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onAssigneeChange(null)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
            <User className="h-3 w-3 text-muted-foreground" />
          </div>
          <span>Unassign</span>
          {!currentIssue?.assigneeId && !assignee && (
            <Check className="h-4 w-4 text-primary ml-auto" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}