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
      case 'yellow': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
      case 'blue': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
      case 'green': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
      default: return 'bg-muted text-muted-foreground border-border'
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