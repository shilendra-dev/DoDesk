'use client'

import React, { useState } from 'react'
import { X, Calendar, User, CheckSquare, Flag } from 'lucide-react'
import { Task } from '@/types/task'
import { Button } from '@/components/ui/atoms/button'
import { Input } from '@/components/ui/atoms/input'
import { Label } from '@/components/ui/atoms/label'
// import { Badge } from '@/components/ui/atoms/badge'
import { AssigneesField } from '@/components/features/tasks/AssigneesField'
// import { TaskNotes } from '@/components/features/tasks/TaskNotes'
import { useTaskStore } from '@/stores/taskStore'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'

const TaskNotes = dynamic(
  () => import('@/components/features/tasks/TaskNotes').then(mod => mod.TaskNotes),
  { ssr: false }
)

interface TaskDetailsProps {
  task: Task
  onClose: () => void
}

export function TaskDetails({ task, onClose }: TaskDetailsProps) {
  const { updateTask, updateNotes } = useTaskStore()
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 300)
  }

  const handleFieldUpdate = async (field: string, value: string) => {
    await updateTask(task.id, { [field]: value })
  }

  const handleNotesUpdate = async (notes: string) => {
    await updateNotes(task.id, notes)
  }

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
//       case 'mid': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
//       case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
//       default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
//     }
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
//       case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
//       case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
//       default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
//     }
//   }

  return (
    <div className={cn(
      "fixed top-0 right-0 w-[400px] h-full bg-background border-l border-border shadow-xl flex flex-col transition-transform duration-300 ease-in-out",
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
            <select
              value={task.status}
              onChange={(e) => handleFieldUpdate('status', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Flag size={16} />
              Priority
            </Label>
            <select
              value={task.priority}
              onChange={(e) => handleFieldUpdate('priority', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="high">High</option>
              <option value="mid">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar size={16} />
            Due Date
          </Label>
          <Input
            type="date"
            value={task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''}
            onChange={(e) => handleFieldUpdate('due_date', e.target.value)}
          />
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