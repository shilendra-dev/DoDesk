'use client'

import React from 'react'
import { Plus, X } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/atoms/avatar'
import { Button } from '@/components/ui/atoms/button'
import { Badge } from '@/components/ui/atoms/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/molecules/select'
import { useTaskEditor } from '@/hooks/useTaskEditor'
import { Task } from '@/types/task'

interface AssigneesFieldProps {
  taskId: string
  assignees: Array<{ id: string; name: string }>
  workspaceId: string
}

export function AssigneesField({ taskId, assignees, workspaceId }: AssigneesFieldProps) {
  const {
    showAssigneeDropdown,
    dropdownMembers,
    // newlyAddedAssigneeIds,
    handleAssigneeDropdownToggle,
    handleAssign,
    handleRemoveAssignee
  } = useTaskEditor({ id: taskId, assignees, workspace_id: workspaceId } as Task)

  const handleAssignMember = async (assigneeId: string) => {
    const currentAssigneeIds = assignees.map(a => a.id)
    const newAssigneeIds = [...currentAssigneeIds, assigneeId]
    await handleAssign(taskId, newAssigneeIds)
  }

  const handleRemoveMember = async (userId: string) => {
    await handleRemoveAssignee(userId)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {(assignees || []).length > 0 ? (
          (assignees || []).map((assignee) => (
            <Badge
              key={assignee.id}
              variant="secondary"
              className="flex items-center gap-1"
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
                onClick={() => handleRemoveMember(assignee.id)}
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X size={10} />
              </Button>
            </Badge>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">No assignees</span>
        )}
      </div>

      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAssigneeDropdownToggle}
          className="flex items-center gap-2"
        >
          <Plus size={14} />
          Add Assignee
        </Button>

        {showAssigneeDropdown && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-md shadow-lg z-50">
            <Select onValueChange={handleAssignMember}>
              <SelectTrigger className="border-0">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {(dropdownMembers || []).map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-4 h-4">
                        <AvatarFallback className="text-xs">
                          {member.name?.charAt(0).toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      {member.name || 'Unknown'}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  )
}