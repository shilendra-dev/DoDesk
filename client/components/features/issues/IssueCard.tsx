'use client'

import React from 'react'
import { Issue } from '@/types/issue'
import { Badge } from '@/components/ui/atoms/badge'
import { Avatar, AvatarFallback } from '@/components/ui/atoms/avatar'
import { Calendar } from 'lucide-react'
import { useIssueStore } from '@/stores/issueStore'
import { cn } from '@/lib/utils'
import { ClientDate } from '@/components/ui/atoms/client-date'

interface IssueCardProps {
  issue: Issue
}

export function IssueCard({ issue }: IssueCardProps) {
  const { setSelectedIssue } = useIssueStore()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'mid': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
      case 'low': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const handleClick = () => {
    setSelectedIssue(issue.id)
  }

  return (
    <div
      className="p-3 bg-background border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      {/* Title */}
      <h3 className="font-medium text-foreground mb-2 line-clamp-2">
        {issue.title}
      </h3>

      {/* Description */}
      {issue.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {issue.description}
        </p>
      )}

      {/* Priority Badge */}
      <div className="flex items-center justify-between mb-3">
        <Badge className={cn("text-xs", getPriorityColor(issue.priority.toString()))}>
          {issue.priority}
        </Badge>
      </div>

      {/* Due Date */}
        {issue.dueDate && (
        <div className="flex items-center gap-1 mb-3 text-xs text-muted-foreground">
          <Calendar size={12} />
          <ClientDate dateString={issue.dueDate} />
        </div>
      )}

      {/* Assignees */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {issue.assignee && (
            <div className="flex -space-x-1">
              <Avatar className="w-5 h-5 border border-background">
                <AvatarFallback className="text-xs">
                  {issue.assignee.name?.charAt(0).toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}