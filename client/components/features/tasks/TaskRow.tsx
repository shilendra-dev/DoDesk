'use client'

import React, { useState } from 'react'
import { Task } from '@/types/task'
import { Badge } from '@/components/ui/atoms/badge'
import { Button } from '@/components/ui/atoms/button'
import { Checkbox } from '@/components/ui/atoms/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/atoms/avatar'
import { MoreHorizontal, Calendar, User, Copy, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/organisms/dropdown-menu'
import { useTaskStore } from '@/stores/taskStore'
import { cn } from '@/lib/utils'
import { ClientDate } from '@/components/ui/atoms/ClientDate'

interface TaskRowProps {
  task: Task
  isSelected: boolean
  onTaskSelect: (task: Task) => void
  onTaskCheck: (taskId: string, checked: boolean) => void
}

export const TaskRow = React.memo(({ task, isSelected, onTaskSelect, onTaskCheck }: TaskRowProps) => {
  const { deleteTask } = useTaskStore()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const handleDuplicateTask = async (task: Task) => {
    // TODO: Implement task duplication
    console.log('Duplicate task:', task.id)
  }

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId)
    setOpenMenuId(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'mid': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
      case 'low': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
      case 'in-progress': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
      case 'completed': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  return (
    <tr
      key={task.id}
      className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => onTaskSelect(task)}
    >
      <td className="p-3" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onTaskCheck(task.id, checked as boolean)}
        />
      </td>
      
      <td className="p-3">
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{task.title}</span>
          {task.description && (
            <span className="text-sm text-muted-foreground truncate max-w-xs">
              {task.description}
            </span>
          )}
        </div>
      </td>
      
      <td className="p-3">
        <Badge className={cn("text-xs", getStatusColor(task.status))}>
          {task.status?.replace('-', ' ') || 'No Status'}
        </Badge>
      </td>
      
      <td className="p-3">
        <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
          {task.priority}
        </Badge>
      </td>
      
      <td className="p-3">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar size={14} />
          <ClientDate dateString={task.due_date} />
        </div>
      </td>
      
      <td className="p-3">
        <div className="flex items-center gap-1">
        {(task.assignees || []).length > 0 ? (
          <>
            <div className="flex -space-x-2">
              {(task.assignees || []).slice(0, 3).map((assignee) => (
                <Avatar key={assignee.id} className="w-6 h-6 border-2 border-background">
                  <AvatarFallback className="text-xs">
                    {assignee.name?.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            {(task.assignees || []).length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{(task.assignees || []).length - 3}
              </span>
            )}
          </>
        ) : (
          <div className="flex items-center gap-1 text-muted-foreground">
            <User size={14} />
            <span className="text-sm">Unassigned</span>
          </div>
        )}
        </div>
      </td>
      
      <td className="p-3">
        <span className="text-sm text-muted-foreground">
          <ClientDate dateString={task.created_at} />
        </span>
      </td>
      
      <td className="p-3">
        <DropdownMenu 
          open={openMenuId === task.id} 
          onOpenChange={(open) => setOpenMenuId(open ? task.id : null)}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => e.stopPropagation()}
              className="h-8 w-8 p-0"
            >
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleDuplicateTask(task)}>
              <Copy size={14} className="mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDeleteTask(task.id)}
              className="text-destructive"
            >
              <Trash2 size={14} className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
})

TaskRow.displayName = 'TaskRow' 