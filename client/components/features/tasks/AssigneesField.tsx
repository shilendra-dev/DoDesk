'use client'

import React, { useEffect, useState } from 'react'
import { Plus, X, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/atoms/avatar'
import { Button } from '@/components/ui/atoms/button'
import { Badge } from '@/components/ui/atoms/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/molecules/popover'
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
  const [isOpen, setIsOpen] = useState(false)
  const { assignTask, removeAssignee } = useTaskStore()

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
    
    const assignee = dropdownMembers.find(m => m.id === assigneeId)
    
    try {
      // Pass assignee name to store for immediate UI update
      await assignTask(taskId, [assigneeId], assignee?.name || '')
      
      // Update dropdown members locally - remove the assigned member
      setDropdownMembers(prev => prev.filter(m => m.id !== assigneeId))
      setIsOpen(false)
    } catch (error) {
      console.error('Error assigning member:', error)
    }
  }

  const handleRemoveMember = async (userId: string) => {
    const removedAssignee = assignees.find(a => a.id === userId)
    
    try {
      await removeAssignee(taskId, userId)
      
      // Add back to dropdown members locally - ensure no duplicates
      if (removedAssignee) {
        setDropdownMembers(prev => {
          const exists = prev.some(m => m.id === removedAssignee.id)
          if (exists) return prev
          return [...prev, removedAssignee]
        })
      }
    } catch (error) {
      console.error('Error removing assignee:', error)
    }
  }

  // Ensure unique members in dropdown
  const uniqueDropdownMembers = dropdownMembers.filter((member, index, self) => 
    index === self.findIndex(m => m.id === member.id)
  )

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {(assignees || []).length > 0 ? (
          (assignees || []).map((assignee) => (
            <Badge
              key={assignee.id}
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
                onClick={() => handleRemoveMember(assignee.id)}
                className="h-4 w-4 p-0 rounded-full hover:bg-destructive hover:text-destructive-foreground"
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
                <span>{isLoading ? "Loading..." : "Add Assignee"}</span>
              </div>
              <ChevronDown size={14} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-0" align="start">
            <div className="max-h-60 overflow-y-auto">
              {uniqueDropdownMembers.length > 0 ? (
                uniqueDropdownMembers.map((member) => (
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