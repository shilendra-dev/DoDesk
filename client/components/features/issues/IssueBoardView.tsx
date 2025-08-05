'use client'

import React, { useMemo } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { IssueColumn } from '@/components/features/issues/IssueColumn'
import { useIssueStore } from '@/stores/issueStore'
import { toast } from 'react-hot-toast'
import { Issue } from '@/types/issue'

interface IssueBoardViewProps {
  issues: Issue[]
}

// New architecture: use canonical state values from backend/types
const COLUMNS = [
  {
    id: 'backlog',
    title: 'Backlog',
    color: 'gray'
  },
  {
    id: 'todo',
    title: 'To Do',
    color: 'yellow'
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    color: 'blue'
  },
  {
    id: 'done',
    title: 'Done',
    color: 'green'
  },
  {
    id: 'canceled',
    title: 'Canceled',
    color: 'red'
  }
] as const

export function IssueBoardView({ issues }: IssueBoardViewProps) {
  const { updateIssue } = useIssueStore()

  // Group filtered issues by state (using canonical state values)
  const groupedIssues = useMemo(() => {
    return issues.reduce((acc, issue) => {
      const state = issue.state
      if (!acc[state]) {
        acc[state] = []
      }
      acc[state].push(issue)
      return acc
    }, {} as Record<string, Issue[]>)
  }, [issues])

  // Handle drag end
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    // If dropped outside droppable area, do nothing
    if (!destination) return

    // If dropped in the same position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return

    try {
      // Update issue state (use canonical state values)
      const validStatuses = COLUMNS.map(col => col.id)
        if (validStatuses.includes(destination.droppableId as typeof COLUMNS[number]['id'])) {
        await updateIssue(draggableId, { state: destination.droppableId })
      }
    } catch (error) {
      console.error('Error updating issue state:', error)
      toast.error('Failed to update issue state')
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Issue Columns */}
      <div className="flex-1 overflow-auto p-2">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 h-full overflow-x-auto flex-nowrap">
            {COLUMNS.map((column) => (
              <div key={column.id} className="min-w-[320px] max-w-xs w-full">
                <IssueColumn
                  column={column}
                  issues={groupedIssues[column.id] || []}
                />
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}