'use client'

import React, { useState, useMemo } from 'react'
import { Task } from '@/types/task'
import { TaskTable } from '@/components/features/tasks/TaskTable'
import { TaskTableSkeleton } from '@/components/features/tasks/TaskTableSkeleton'
import { TaskFilterBar } from '@/components/features/tasks/TaskFilterBar'
import { Pagination } from '@/components/features/tasks/Pagination'
import { useTaskFiltering } from '@/hooks/useTaskFiltering'
import { usePagination } from '@/hooks/usePagination'

interface TaskListViewProps {
  tasks: Task[]
  isLoading?: boolean
}

export function TaskListView({ tasks, isLoading = false }: TaskListViewProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 15

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

  // Use pagination hook
  const { currentItems: currentTasks, totalPages } = usePagination(
    filteredTasks,
    tasksPerPage,
    currentPage
  )

  // Memoize assignee options separately to avoid recreating entire config
  const assigneeOptions = useMemo(() => {
    const uniqueAssignees = tasks
      .flatMap(task => task.assignees || [])
      .filter((assignee) => assignee?.name)
      .filter((assignee, index, self) => 
        index === self.findIndex(a => a.name === assignee.name)
      )
    
    return [
      { value: "All", label: "All" },
      ...uniqueAssignees.map(assignee => ({ value: assignee.name, label: assignee.name }))
    ]
  }, [tasks])

  // Filter options for the filter bar - only recreate when values change
  const filterConfigs = useMemo(() => [
    {
      label: "Status",
      id: "statusFilter",
      value: statusFilter,
      onChange: setStatusFilter,
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
      onChange: setPriorityFilter,
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
      onChange: setAssigneeFilter,
      options: assigneeOptions
    }
  ], [statusFilter, priorityFilter, assigneeFilter, assigneeOptions])

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

      {/* Task Table */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <TaskTableSkeleton />
        ) : (
          <TaskTable tasks={currentTasks} />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-border p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}