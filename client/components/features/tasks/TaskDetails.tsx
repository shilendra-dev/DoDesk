'use client'

import React, { useState } from 'react'
import { X, Calendar, User, CheckSquare, Flag, CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/atoms/button'
import { Input } from '@/components/ui/atoms/input'
import { Label } from '@/components/ui/atoms/label'
import { AssigneesField } from '@/components/features/tasks/AssigneesField'
import { useTaskStore, useTask } from '@/stores/taskStore'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/atoms/select'
import { Calendar as CalendarComponent } from '@/components/ui/atoms/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/molecules/popover'
import { format } from 'date-fns'

const TaskNotes = dynamic(
  () => import('@/components/features/tasks/TaskNotes').then(mod => mod.TaskNotes),
  { ssr: false }
)

interface TaskDetailsProps {
  taskId: string
  onClose: () => void
}

export function TaskDetails({ taskId, onClose }: TaskDetailsProps) {
  // Get task directly from store using the custom hook
  const task = useTask(taskId)
  const { updateTask, updateNotes, updateTaskDate } = useTaskStore()
  const [isClosing, setIsClosing] = useState(false)

  // If task doesn't exist, don't render
  if (!task) {
    return null
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 300)
  }

  const handleFieldUpdate = async (field: string, value: string) => {
    await updateTask(taskId, { [field]: value })
  }

  const handleNotesUpdate = async (notes: string) => {
    await updateNotes(taskId, notes)
  }

  const handleDateSelect = async (selectedDate: Date | undefined) => {
    await updateTaskDate(taskId, selectedDate)
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
            value={task.title}
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
              value={task.status || ''}
              onValueChange={(value) => handleFieldUpdate('status', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Flag size={16} />
              Priority
            </Label>
            <Select
              value={task.priority}
              onValueChange={(value) => handleFieldUpdate('priority', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="mid">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="date"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !task.due_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {task.due_date ? format(new Date(task.due_date), "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={task.due_date ? new Date(task.due_date) : undefined}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Assignees */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <User size={16} />
            Assignees
          </Label>
          <AssigneesField
            taskId={task.id}
            assignees={task.assignees}
            workspaceId={task.workspace_id}
          />
        </div>

        {/* Created By */}
        <div className="space-y-2">
          <Label>Created By</Label>
          <p className="text-sm text-muted-foreground">
            {task.created_by_name || '—'}
          </p>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label>Notes</Label>
          <TaskNotes
            initialContent={task.notes || ''}
            onUpdate={handleNotesUpdate}
          />
        </div>
      </div>
    </div>
  )
}