'use client'

import React, { useState } from 'react'
import { X, Calendar, User, CheckSquare, Flag } from 'lucide-react'
import { Button } from '@/components/ui/atoms/button'
import { Input } from '@/components/ui/atoms/input'
import { Label } from '@/components/ui/atoms/label'
import { AssigneesField } from '@/components/features/issues/AssigneesField'
import { useIssueStore } from '@/stores/issueStore'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/atoms/select'
import { IssueNotes } from '@/components/features/issues/IssueNotes'
import { DueDatePicker } from '@/components/ui/molecules/DueDatePicker'

interface IssueDetailsProps {
  issueId: string
  onClose: () => void
}

export function IssueDetails({ issueId, onClose }: IssueDetailsProps) {
  // Get issue directly from store using the getIssueById selector
  const issue = useIssueStore(state => state.getIssueById(issueId))
  const { updateIssue, updateNotes } = useIssueStore()
  const [isClosing, setIsClosing] = useState(false)

  // If task doesn't exist, don't render
  if (!issue) {
    return null
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 300)
  }

  const handleFieldUpdate = async (field: string, value: string | number) => {
    await updateIssue(issueId, { [field]: value })
  }

  const handleNotesUpdate = async (notes: string) => {
    await updateNotes(issueId, notes)
  }

  return (
    <div className={cn(
     "absolute top-0 right-0 w-[70vw] h-full bg-background border-l border-border shadow-xl flex flex-col transition-transform duration-300 ease-in-out",
     isClosing ? "translate-x-full" : "translate-x-0"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Task Details</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="h-8 w-8 p-0"
        >
          <X size={16} />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={issue.title}
            onChange={(e) => handleFieldUpdate('title', e.target.value)}
            placeholder="Enter task title"
          />
        </div>

        {/* Status and Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CheckSquare size={16} />
              Status
            </Label>
            <Select
              value={issue.state || ''}
              onValueChange={(value) => handleFieldUpdate('state', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Flag size={16} />
              Priority
            </Label>
            <Select
              value={issue.priority?.toString() ?? '0'}
              onValueChange={(value) => handleFieldUpdate('priority', Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Urgent</SelectItem>
                <SelectItem value="2">High</SelectItem>
                <SelectItem value="3">Medium</SelectItem>
                <SelectItem value="4">Low</SelectItem>
                <SelectItem value="0">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex flex-1 gap-2">
          <Label className="flex items-center gap-2 text-nowrap pr-2">
            <Calendar size={16} />
            Due Date
          </Label>
          <DueDatePicker
            value={issue.dueDate}
            onChange={dueDate => handleFieldUpdate('dueDate', dueDate ?? '')}
          />
        </div>

        {/* Assignees */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <User size={16} />
            Assignees
          </Label>
          <AssigneesField
            issueId={issueId}
            assignee={issue.assignee ? { id: issue.assignee.id, name: issue.assignee.name || 'Unknown' } : undefined}
            workspaceId={issue.workspaceId}
          />
        </div>

        {/* Created By */}
        <div className="space-y-2">
          <Label>Created By</Label>
          <p className="text-sm text-muted-foreground">
            {issue.creator?.name || '—'}
          </p>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label>Notes</Label>
          <IssueNotes
            initialContent={issue.notes || ''}
            onUpdate={handleNotesUpdate}
          />
        </div>
      </div>
    </div>
  )
}