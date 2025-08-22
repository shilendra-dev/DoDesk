'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Issue } from '@/types/issue'
import { Badge } from '@/components/ui/atoms/badge'
import { Avatar, AvatarFallback } from '@/components/ui/atoms/avatar'
import { Calendar, Flag } from 'lucide-react'
import { useIssueStore } from '@/stores/issueStore'
import { cn } from '@/lib/utils'
import { ClientDate } from '@/components/ui/atoms/client-date'

interface IssueCardProps {
  issue: Issue
  workspaceSlug: string
}

export function IssueCard({ issue, workspaceSlug }: IssueCardProps) {
  const { setSelectedIssue } = useIssueStore()
  const router = useRouter()

  // --- Priority Badge Color ---
  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-100 text-red-600 border-red-200'
      case 2: return 'bg-orange-100 text-orange-600 border-orange-200'
      case 3: return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 4: return 'bg-blue-100 text-blue-600 border-blue-200'
      case 0: return 'bg-muted text-muted-foreground border-border'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  // --- Card Click Handler ---
  const handleClick = () => {
    setSelectedIssue(issue.id)
    router.push(`/${workspaceSlug}/issue/${issue.issueKey}`)
  }

  // --- Render ---
  return (
    <div
      className="p-4 bg-card border border-border rounded-xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer flex flex-col gap-2 min-h-[150px]"
      onClick={handleClick}
    >
      {/* --- Title --- */}
      <div>
        <span className="block text-xs text-muted-foreground font-medium mb-1">Title</span>
        <h3 className="font-semibold text-lg text-foreground line-clamp-2">
          {issue.title}
        </h3>
      </div>

      {/* --- Priority and Due Date --- */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Flag className="w-4 h-4 text-muted-foreground" />
          <Badge className={cn("text-xs px-2 py-0.5 border", getPriorityColor(issue.priority))}>
            {issue.priority ? `P${issue.priority}` : "None"}
          </Badge>
        </div>
        {issue.dueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={14} />
            <ClientDate dateString={issue.dueDate} />
          </div>
        )}
      </div>

      {/* --- Assignee --- */}
      <div className="flex items-center gap-2 mt-auto">
        <span className="block text-xs text-muted-foreground font-medium">Assignee:</span>
        {issue.assignee ? (
          <div className="flex items-center gap-1">
            <Avatar className="w-5 h-5 border border-background">
              <AvatarFallback className="text-xs">
                {issue.assignee.name?.charAt(0).toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
            <span className="ml-1 text-xs text-foreground">{issue.assignee.name}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Unassigned</span>
        )}
      </div>
    </div>
  )
}