'use client'

import React, { useMemo, useState } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { IssueColumn } from '@/components/features/issues/IssueColumn'
import { IssueFilterBar } from '@/components/features/issues/IssueFilterBar'
import { useIssueStore } from '@/stores/issueStore'
import { useIssueFiltering } from '@/hooks/useIssueFiltering'
import { toast } from 'react-hot-toast'
import { Issue } from '@/types/issue'
import { useTeamStore } from '@/stores/teamStore'

interface IssueBoardViewProps {
  issues: Issue[]
}

const COLUMNS = {
  PENDING: {
    id: 'pending',
    title: 'Pending',
    color: 'yellow'
  },
  IN_PROGRESS: {
    id: 'in-progress',
    title: 'In Progress',
    color: 'blue'
  },
  COMPLETED: {
    id: 'completed',
    title: 'Completed',
    color: 'green'
  }
}

export function IssueBoardView({ issues }: IssueBoardViewProps) {
  const { updateIssue } = useIssueStore()
  const { teams: teamList } = useTeamStore()
  const [teamFilter, setTeamFilter] = useState('All')
  const [sortOptions] = useState([
    { label: 'None', value: 'None' },
    { label: 'Priority', value: 'Priority' },
    { label: 'Assignee', value: 'Assignee' },
    { label: 'Created At', value: 'Created At' }
  ])
  // Use filtering hook
  const {
    stateFilter,
    setStateFilter,
    priorityFilter,
    setPriorityFilter,
    assigneeFilter,
    setAssigneeFilter,
    sortOption,
    setSortOption,
    filteredIssues,
    clearAllFilters,
    hasActiveFilters,
    filterSummary
  } = useIssueFiltering()

  // Group filtered issues by state
  const groupedIssues = useMemo(() => {
    return filteredIssues.reduce((acc, issue) => {
      const state = issue.state.toLowerCase()
      if (!acc[state]) {
        acc[state] = []
      }
      acc[state].push(issue)
      return acc
    }, {} as Record<string, Issue[]>)
  }, [filteredIssues])

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
      // Update issue state
      const validStatuses = ['pending', 'in-progress', 'completed'] as const
      type Status = (typeof validStatuses)[number]

      if (validStatuses.includes(destination.droppableId as Status)) {
        await updateIssue(draggableId, { state: destination.droppableId as Status })
      }
    } catch (error) {
      console.error('Error updating issue state:', error)
      toast.error('Failed to update issue state')
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Filter Bar */}
      <IssueFilterBar
        issues={issues}
        teams={teamList}
        stateFilter={stateFilter}
        setStateFilter={setStateFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        assigneeFilter={assigneeFilter}
        setAssigneeFilter={setAssigneeFilter}
        teamFilter={teamFilter}
        setTeamFilter={setTeamFilter}
        sortOption={sortOption}
        setSortOption={setSortOption}
        sortOptions={sortOptions}
        hasActiveFilters={hasActiveFilters}
        filterSummary={filterSummary}
        onClearAll={clearAllFilters}
      />

      {/* Issue Columns */}
      <div className="flex-1 overflow-auto p-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 h-full">
            {Object.values(COLUMNS).map((column) => (
              <IssueColumn
                key={column.id}
                column={column}
                issues={groupedIssues[column.id] || []}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}