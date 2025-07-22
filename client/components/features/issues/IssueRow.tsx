'use client'

import React, { useState } from 'react'
import { Issue } from '@/types/issue'
import { Badge } from '@/components/ui/atoms/badge'
import { Button } from '@/components/ui/atoms/button'
import { Checkbox } from '@/components/ui/atoms/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/atoms/avatar'
import { MoreHorizontal, Calendar, User, Copy, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/organisms/dropdown-menu'
import { useIssueStore } from '@/stores/issueStore'
import { cn } from '@/lib/utils'
import { ClientDate } from '@/components/ui/atoms/ClientDate'

interface IssueRowProps {
  issue: Issue
  isSelected: boolean
  onIssueSelect: (issue: Issue) => void
  onIssueCheck: (issueId: string, checked: boolean) => void
}

export const IssueRow = React.memo(({ issue, isSelected, onIssueSelect, onIssueCheck }: IssueRowProps) => {
  const { deleteIssue } = useIssueStore()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const handleDuplicateIssue = async (issue: Issue) => {
    // TODO: Implement issue duplication
    console.log('Duplicate issue:', issue.id)
  }

  const handleDeleteIssue = async (issueId: string) => {
    await deleteIssue(issueId)
    setOpenMenuId(null)
  }

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'Urgent'
      case 2: return 'High'
      case 3: return 'Medium'
      case 4: return 'Low'
      default: return 'None'
    }
  }

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-destructive/10 text-destructive border-destructive/20'
      case 2: return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
      case 3: return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
      case 4: return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getStateLabel = (state: string) => {
    switch (state) {
      case 'backlog': return 'Backlog'
      case 'todo': return 'To Do'
      case 'in_progress': return 'In Progress'
      case 'done': return 'Done'
      case 'canceled': return 'Canceled'
      default: return state
    }
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case 'backlog': return 'bg-gray-200 text-gray-700 border-gray-300'
      case 'todo': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'in_progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'done': return 'bg-green-100 text-green-700 border-green-200'
      case 'canceled': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  return (
    <tr
      key={issue.id}
      className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => onIssueSelect(issue)}
    >
      <td className="p-3" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onIssueCheck(issue.id, checked as boolean)}
        />
      </td>
      
      <td className="p-3">
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{issue.title}</span>
          {issue.description && (
            <span className="text-sm text-muted-foreground truncate max-w-xs">
              {issue.description}
            </span>
          )}
        </div>
      </td>
      
      <td className="p-3">
        <Badge className={cn("text-xs", getStateColor(issue.state))}>
          {getStateLabel(issue.state)}
        </Badge>
      </td>
      
      <td className="p-3">
        <Badge className={cn("text-xs", getPriorityColor(issue.priority))}>
          {getPriorityLabel(issue.priority)}
        </Badge>
      </td>
      
      <td className="p-3">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar size={14} />
          <ClientDate dateString={issue.dueDate} />
        </div>
      </td>
      
      <td className="p-3">
        <div className="flex items-center gap-1">
          {issue.assignee ? (
            <Avatar className="w-6 h-6 border-2 border-background">
              <AvatarFallback className="text-xs">
                {issue.assignee.name?.charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
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
          <ClientDate dateString={issue.createdAt} />
        </span>
      </td>
      
      <td className="p-3">
        <DropdownMenu 
          open={openMenuId === issue.id} 
          onOpenChange={(open) => setOpenMenuId(open ? issue.id : null)}
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
            <DropdownMenuItem onClick={() => handleDuplicateIssue(issue)}>
              <Copy size={14} className="mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDeleteIssue(issue.id)}
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

IssueRow.displayName = 'IssueRow'