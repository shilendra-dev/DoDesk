'use client'

import React from 'react'
import { Task } from '@/types/task'
import { Badge } from '@/components/ui/atoms/badge'
import { Avatar, AvatarFallback } from '@/components/ui/atoms/avatar'
import { Calendar, User } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const { setSelectedTask } = useTaskStore()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'mid': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString()
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
          {formatDate(task.due_date)}
        </div>
      )}

      {/* Assignees */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {task.assignees.length > 0 ? (
            <>
              <div className="flex -space-x-1">
                {task.assignees.slice(0, 2).map((assignee) => (
                  <Avatar key={assignee.id} className="w-5 h-5 border border-background">
                    <AvatarFallback className="text-xs">
                      {assignee.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              {task.assignees.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{task.assignees.length - 2}
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