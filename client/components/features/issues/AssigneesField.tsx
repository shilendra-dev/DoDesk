'use client'

import React, { useEffect, useState } from 'react'
import { Plus, X, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/atoms/avatar'
import { Button } from '@/components/ui/atoms/button'
import { Badge } from '@/components/ui/atoms/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/molecules/popover'
import { useIssueStore } from '@/stores/issueStore'
import { useWorkspaceStore } from '@/stores/workspaceStore'

interface AssigneesFieldProps {
  issueId: string
  assignee?: { id: string; name: string }
  workspaceId: string
}

export function AssigneesField({ issueId, assignee, workspaceId }: AssigneesFieldProps) {
  const [dropdownMembers, setDropdownMembers] = useState<Array<{ id: string; name: string; email?: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { assignIssue } = useIssueStore()
  const { members } = useWorkspaceStore()
  // Load available members when component mounts
  
  useEffect(() => {
    const loadMembers = async () => {
      try {
        setIsLoading(true)
        setDropdownMembers(
          members
            .filter(member => member.user.id !== assignee?.id)
            .map(member => ({
              id: member.user.id,
              name: member.user.name ?? '',
              email: member.user.email
            }))
        )
      } catch (error) {
        console.error('Error fetching members:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadMembers()
  }, [workspaceId, members, assignee])

  const handleAssignMember = async (assigneeId: string) => {
    if (assigneeId === 'no-members') return
    try {
      await assignIssue(issueId, assigneeId)
      setIsOpen(false)
    } catch (error) {
      console.error('Error assigning member:', error)
    }
  }

  const handleRemoveAssignee = async () => {
    try {
      await assignIssue(issueId, '') // Unassign
    } catch (error) {
      console.error('Error removing assignee:', error)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {assignee ? (
          <Badge
            variant="outline"
            className="flex items-center gap-1 p-1"
          >
            <Avatar className="w-4 h-4">
              <AvatarFallback className="text-xs">
                {assignee.name?.charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            {assignee.name || 'Unknown'}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveAssignee}
              className="h-4 w-4 p-0 rounded-full hover:bg-destructive hover:text-destructive-foreground"
            >
              <X size={10} />
            </Button>
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">No assignee</span>
        )}
      </div>

      <div className="w-48">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="w-full justify-between"
            >
              <div className="flex items-center gap-2">
                <Plus size={14} />
                <span>{isLoading ? "Loading..." : assignee ? "Change Assignee" : "Add Assignee"}</span>
              </div>
              <ChevronDown size={14} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-0" align="start">
            <div className="max-h-60 overflow-y-auto">
              {dropdownMembers.length > 0 ? (
                dropdownMembers.map((member) => (
                  <Button
                    key={member.id}
                    variant="ghost"
                    className="w-full justify-start p-2 h-auto"
                    onClick={() => handleAssignMember(member.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="w-4 h-4">
                        <AvatarFallback className="text-xs">
                          {member.name?.charAt(0).toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.name || 'Unknown'}</span>
                    </div>
                  </Button>
                ))
              ) : (
                <div className="p-2 text-sm text-muted-foreground">
                  No available members
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}