'use client'

import React, { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/atoms/avatar'
import { Button } from '@/components/ui/atoms/button'
import { Badge } from '@/components/ui/atoms/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/atoms/select'
import { taskService } from '@/services/taskService'
import { useTaskStore } from '@/stores/taskStore'

interface AssigneesFieldProps {
  taskId: string
  assignees: Array<{ id: string; name: string }>
  workspaceId: string
}

export function AssigneesField({ taskId, assignees, workspaceId }: AssigneesFieldProps) {
  const [dropdownMembers, setDropdownMembers] = useState<Array<{ id: string; name: string; email?: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const { fetchTasks } = useTaskStore()

  // Load available members when component mounts
  useEffect(() => {
    const loadMembers = async () => {
      try {
        setIsLoading(true)
        const availableMembers = await taskService.getAvailableMembers(workspaceId, assignees || [])
        setDropdownMembers(availableMembers)
      } catch (error) {
        console.error('Error fetching members:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadMembers()
  }, [workspaceId, assignees])

  const handleAssignMember = async (assigneeId: string) => {
    if (assigneeId === 'no-members') return
    
    try {
      // Use service function to assign member
      await taskService.assignTask(taskId, [assigneeId])
      
      // Refresh tasks to get updated assignee data
      await fetchTasks(workspaceId)
      
      // Refresh available members list
      const updatedMembers = await taskService.getAvailableMembers(workspaceId, [...(assignees || []), { id: assigneeId, name: 'Loading...' }])
      setDropdownMembers(updatedMembers)
    } catch (error) {
      console.error('Error assigning member:', error)
    }
  }

  const handleRemoveMember = async (userId: string) => {
    try {
      // Use service function to remove assignee
      await taskService.removeAssignee(taskId, userId)
      
      // Refresh tasks to get updated assignee data
      await fetchTasks(workspaceId)
      
      // Refresh available members list
      const updatedMembers = await taskService.getAvailableMembers(workspaceId, (assignees || []).filter(a => a.id !== userId))
      setDropdownMembers(updatedMembers)
    } catch (error) {
      console.error('Error removing assignee:', error)
    }
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

      <div className="w-48">
        <Select onValueChange={handleAssignMember} disabled={isLoading}>
          <SelectTrigger className="flex items-center gap-2">
            <Plus size={14} />
            <SelectValue placeholder={isLoading ? "Loading..." : "Add Assignee"} />
          </SelectTrigger>
          <SelectContent>
            {(dropdownMembers || []).length > 0 ? (
              (dropdownMembers || []).map((member) => (
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
              ))
            ) : (
              <SelectItem value="no-members" disabled>
                No available members
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}