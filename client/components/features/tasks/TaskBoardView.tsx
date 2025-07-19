'use client'

import React, { useMemo } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { Task } from '@/types/task'
import { TaskColumn } from '@/components/features/tasks/TaskColumn'
import { TaskFilterBar } from '@/components/features/tasks/TaskFilterBar'
import { useTaskStore } from '@/stores/taskStore'
import { useTaskFiltering } from '@/hooks/useTaskFiltering'
import { toast } from 'react-hot-toast'

interface TaskBoardViewProps {
  tasks: Task[]
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

export function TaskBoardView({ tasks }: TaskBoardViewProps) {
  const { updateTask } = useTaskStore()

  // Use filtering hook
  const {
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    assigneeFilter,
    setAssigneeFilter,
    sortOption,
    setSortOption,
    filteredTasks,
    handleClearAll,
    hasActiveFilters,
    filterSummary
  } = useTaskFiltering(tasks)

  // Group filtered tasks by status
  const groupedTasks = useMemo(() => {
    return filteredTasks.reduce((acc, task) => {
      const status = task.status.toLowerCase()
      if (!acc[status]) {
        acc[status] = []
      }
      acc[status].push(task)
      return acc
    }, {} as Record<string, Task[]>)
  }, [filteredTasks])

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
      // Update task status
      const validStatuses = ['pending', 'in-progress', 'completed'] as const
      type Status = (typeof validStatuses)[number]

      if (validStatuses.includes(destination.droppableId as Status)) {
        await updateTask(draggableId, { status: destination.droppableId as Status })
      }
    } catch (error) {
      console.error('Error updating task status:', error)
      toast.error('Failed to update task status')
    }
  }

  // Filter options for the filter bar
  const filterConfigs = useMemo(() => [
    {
      label: "Status",
      id: "statusFilter",
      value: statusFilter,
      onChange: (value: string) => setStatusFilter(value),
      options: [
        { value: "All", label: "All" },
        { value: "pending", label: "Pending" },
        { value: "in-progress", label: "In Progress" },
        { value: "completed", label: "Completed" }
      ]
    },
    {
      label: "Priority",
      id: "priorityFilter",
      value: priorityFilter,
      onChange: (value: string) => setPriorityFilter(value),
      options: [
        { value: "All", label: "All" },
        { value: "high", label: "High" },
        { value: "mid", label: "Medium" },
        { value: "low", label: "Low" }
      ]
    },
    {
      label: "Assignee",
      id: "assigneeFilter",
      value: assigneeFilter,
      onChange: (value: string) => setAssigneeFilter(value),
      options: [
        { value: "All", label: "All" },
        ...tasks
          .flatMap(task => task.assignees || [])
          .filter(assignee => assignee?.name)
          .filter((assignee, index, self) => 
            index === self.findIndex(a => a?.name === assignee.name)
          )
          .map(assignee => ({ value: assignee.name, label: assignee.name }))
      ]
    }
  ], [statusFilter, priorityFilter, assigneeFilter, tasks, setStatusFilter, setPriorityFilter, setAssigneeFilter])

  const sortOptions = [
    { value: "None", label: "None" },
    { value: "Due Date (Asc)", label: "Due Date (Asc)" },
    { value: "Due Date (Desc)", label: "Due Date (Desc)" },
    { value: "Priority (High → Low)", label: "Priority (High → Low)" },
    { value: "Priority (Low → High)", label: "Priority (Low → High)" },
    { value: "Title (A → Z)", label: "Title (A → Z)" },
    { value: "Title (Z → A)", label: "Title (Z → A)" },
    { value: "Date Created (Newest)", label: "Date Created (Newest)" },
    { value: "Date Created (Oldest)", label: "Date Created (Oldest)" }
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Filter Bar */}
      <TaskFilterBar
        filterConfigs={filterConfigs}
        sortOption={sortOption}
        setSortOption={setSortOption}
        sortOptions={sortOptions}
        hasActiveFilters={hasActiveFilters}
        filterSummary={filterSummary}
        onClearAll={handleClearAll}
      />

      {/* Task Columns */}
      <div className="flex-1 overflow-auto p-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 h-full">
            {Object.values(COLUMNS).map((column) => (
              <TaskColumn
                key={column.id}
                column={column}
                tasks={groupedTasks[column.id] || []}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}