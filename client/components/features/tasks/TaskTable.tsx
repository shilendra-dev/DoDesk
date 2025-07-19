'use client'

import React, { useState } from 'react'
import { Task } from '@/types/task'
import { Checkbox } from '@/components/ui/atoms/checkbox'
import { useTaskStore } from '@/stores/taskStore'
import { TaskRow } from './TaskRow'

interface TaskTableProps {
  tasks: Task[]
}

const TaskTableComponent = ({ tasks }: TaskTableProps) => {
  const { setSelectedTask } = useTaskStore()
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())

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
            <TaskRow
              key={task.id}
              task={task}
              isSelected={selectedTasks.has(task.id)}
              onTaskSelect={handleTaskSelect}
              onTaskCheck={handleTaskCheck}
            />
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