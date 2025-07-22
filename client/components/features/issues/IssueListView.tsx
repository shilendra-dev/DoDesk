'use client'

import React, { useState } from 'react'
import { Issue } from '@/types/issue'
import { IssueTable } from '@/components/features/issues/IssuesTable'
import { IssuesTableSkeleton } from '@/components/features/issues/IssuesTableSkeleton'
import { IssueFilterBar } from '@/components/features/issues/IssueFilterBar'
import { Pagination } from '@/components/features/issues/Pagination'
import { useIssueFiltering } from '@/hooks/useIssueFiltering'
import { usePagination } from '@/hooks/usePagination'
import { useTeamStore } from '@/stores/teamStore'

interface IssueListViewProps {
  issues: Issue[]
  isLoading?: boolean
}

export function IssueListView({ issues, isLoading = false }: IssueListViewProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const issuesPerPage = 15
  const { teams } = useTeamStore()
  const [teamFilter, setTeamFilter] = useState('All')

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

  // Use pagination hook
  const { currentItems: currentIssues, totalPages } = usePagination(
    filteredIssues,
    issuesPerPage,
    currentPage
  )

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
      <IssueFilterBar
        issues={issues}
        teams={teams}
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

      {/* Issue Table */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <IssuesTableSkeleton />
        ) : (
          <IssueTable issues={currentIssues} />
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