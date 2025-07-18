'use client'

import React from 'react'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import { Task } from '@/types/task'
import { TaskCard } from '@/components/features/tasks/TaskCard'
import { Badge } from '@/components/ui/atoms/badge'
import { cn } from '@/lib/utils'

interface TaskColumnProps {
  column: {
    id: string
    title: string
    color: string
  }
  tasks: Task[]
}

export function TaskColumn({ column, tasks }: TaskColumnProps) {
  const getColumnColor = (color: string) => {
    switch (color) {
      case 'yellow': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'blue': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'green': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="flex flex-col w-80">
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-t-lg border border-border">
        <div className="flex items-center gap-2">
          <Badge className={cn("text-xs", getColumnColor(column.color))}>
            {column.title}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 p-2 bg-muted/10 border-x border-b border-border rounded-b-lg min-h-[500px]",
              snapshot.isDraggingOver && "bg-muted/30"
            )}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(
                      "mb-2",
                      snapshot.isDragging && "opacity-50"
                    )}
                  >
                    <TaskCard task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            
            {tasks.length === 0 && (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <p className="text-sm">No tasks</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}