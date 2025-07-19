'use client'

import React from 'react'
import { Task } from '@/types/task'
import { Badge } from '@/components/ui/atoms/badge'
import { Avatar, AvatarFallback } from '@/components/ui/atoms/avatar'
import { Calendar, User } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { cn } from '@/lib/utils'
import { ClientDate } from '@/components/ui/atoms/client-date'

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const { setSelectedTask } = useTaskStore()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'mid': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
      case 'low': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const handleClick = () => {
    setSelectedTask(task)
  }

  return (
    <div
      className="p-3 bg-background border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      {/* Title */}
      <h3 className="font-medium text-foreground mb-2 line-clamp-2">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Priority Badge */}
      <div className="flex items-center justify-between mb-3">
        <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
          {task.priority}
        </Badge>
      </div>

      {/* Due Date */}
      {task.due_date && (
        <div className="flex items-center gap-1 mb-3 text-xs text-muted-foreground">
          <Calendar size={12} />
          <ClientDate dateString={task.due_date} />
        </div>
      )}

      {/* Assignees */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {(task.assignees || []).length > 0 ? (
            <>
              <div className="flex -space-x-1">
                {(task.assignees || []).slice(0, 2).map((assignee) => (
                  <Avatar key={assignee.id} className="w-5 h-5 border border-background">
                    <AvatarFallback className="text-xs">
                      {assignee.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              {(task.assignees || []).length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{(task.assignees || []).length - 2}
                </span>
              )}
            </>
          ) : (
            <div className="flex items-center gap-1 text-muted-foreground">
              <User size={12} />
              <span className="text-xs">Unassigned</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}