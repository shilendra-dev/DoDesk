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

interface TaskTableProps {
  tasks: Task[]
}

const TaskTableComponent = ({ tasks }: TaskTableProps) => {
  const { setSelectedTask, deleteTask } = useTaskStore()
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task)
  }

  const handleTaskCheck = (taskId: string, checked: boolean) => {
    setSelectedTasks(prev => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(taskId)
      } else {
        newSet.delete(taskId)
      }
      return newSet
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(new Set(tasks.map(task => task.id)))
    } else {
      setSelectedTasks(new Set())
    }
  }

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
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'mid': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="w-full">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="p-3 text-left">
              <Checkbox
                checked={selectedTasks.size === tasks.length && tasks.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Title</th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Status</th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Priority</th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Due Date</th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Assignees</th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Created</th>
            <th className="p-3 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => handleTaskSelect(task)}
            >
              <td className="p-3" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedTasks.has(task.id)}
                  onCheckedChange={(checked) => handleTaskCheck(task.id, checked as boolean)}
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
                  {task.status.replace('-', ' ')}
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
          ))}
        </tbody>
      </table>
      
      {tasks.length === 0 && (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <div className="text-center">
            <p className="text-lg font-medium">No tasks found</p>
            <p className="text-sm">Create your first task to get started</p>
          </div>
        </div>
      )}
    </div>
  )
}

export const TaskTable = React.memo(TaskTableComponent)
TaskTable.displayName = 'TaskTable'