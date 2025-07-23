'use client'

import React, { useMemo, useState } from 'react'
import { X, Filter } from 'lucide-react'
import { Button } from '@/components/ui/atoms/button'
import { Badge } from '@/components/ui/atoms/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/atoms/select'
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/organisms/dialog'
// import { Input } from '@/components/ui/atoms/input'
// import { Label } from '@/components/ui/atoms/label'
import { useSavedFilterStore } from '@/stores/savedFilterStore'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { Issue } from '@/types/issue'

interface IssueFilterBarProps {
  issues: Issue[]
  teams: { id: string; name: string }[]
  stateFilter: string
  setStateFilter: (value: string) => void
  priorityFilter: string
  setPriorityFilter: (value: string) => void
  assigneeFilter: string
  setAssigneeFilter: (value: string) => void
  teamFilter: string
  setTeamFilter: (value: string) => void
  sortOption: string
  setSortOption: (option: string) => void
  sortOptions: { value: string; label: string }[]
  hasActiveFilters: boolean
  filterSummary: string
  onClearAll: () => void
}

export function IssueFilterBar({
  issues,
  teams,
  stateFilter,
  setStateFilter,
  priorityFilter,
  setPriorityFilter,
  assigneeFilter,
  setAssigneeFilter,
  teamFilter,
  setTeamFilter,
  sortOption,
  setSortOption,
  sortOptions,
  hasActiveFilters,
  filterSummary,
  onClearAll
}: IssueFilterBarProps) {
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace)
  const { savedFilters, selectedViewId, createFilter, deleteFilter, setSelectedViewId } = useSavedFilterStore()
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [filterName, setFilterName] = useState('')

  // Assignee options
  const assigneeOptions = useMemo(() => [
    { value: "All", label: "All Assignees" },
    ...issues
      .map(issue => issue.assignee)
      .filter(assignee => assignee?.name)
      .filter((assignee, idx, self) =>
        idx === self.findIndex(a => a?.name === assignee?.name)
      )
      .map(assignee => ({ value: assignee!.name!, label: assignee!.name! }))
  ], [issues])

  // Filter options
  const teamOptions = [
    { value: "All", label: "All Teams" },
    ...teams.map(team => ({ value: team.id, label: team.name }))
  ]

  const priorityOptions = [
    { value: "All", label: "All Priorities" },
    { value: "1", label: "P1" },
    { value: "2", label: "P2" },
    { value: "3", label: "P3" },
    { value: "4", label: "P4" },
    { value: "0", label: "P0" }
  ]

  const stateOptions = [
    { value: "All", label: "All States" },
    { value: "backlog", label: "Backlog" },
    { value: "todo", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "done", label: "Done" },
    { value: "canceled", label: "Canceled" }
  ]

  const handleSaveFilter = async () => {
    if (!filterName.trim() || !currentWorkspace?.id) return

    const filterConfig = {
      stateFilter,
      priorityFilter,
      assigneeFilter,
      teamFilter,
      sortOption
    }

    await createFilter(currentWorkspace.id, {
      name: filterName.trim(),
      filter_config: filterConfig
    })

    setFilterName('')
    setShowSaveDialog(false)
  }

  const handleViewSelect = (viewId: string) => {
    if (viewId === 'none') {
      onClearAll()
      return
    }
    setSelectedViewId(viewId)
  }

  const handleDeleteView = async () => {
    if (!currentWorkspace?.id || selectedViewId === 'none') return
    await deleteFilter(currentWorkspace.id, selectedViewId)
  }

  return (
    <div className="border-b border-border bg-background/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section - Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {/* Saved Views */}
          <Select value={selectedViewId} onValueChange={handleViewSelect}>
            <SelectTrigger className="w-[120px] h-5 text-sm border">
              <SelectValue placeholder="Views" />
            </SelectTrigger>
            <SelectContent className="w-[120px]">
              <SelectItem value="none">All Issues</SelectItem>
              {savedFilters.map((filter) => (
                <SelectItem key={filter.id} value={filter.id}>
                  {filter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="w-px h-6 bg-border" />
          {/* Filter Controls */}
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="w-[140px] h-5 text-sm">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent className="w-[140px]">
              {stateOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px] h-7 text-sm">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="w-[140px]">
              {priorityOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-[140px] h-7 text-sm">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent className="w-[140px]">
              {assigneeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* <Select value={teamFilter} onValueChange={setTeamFilter}>
            <SelectTrigger className="w-[90px] h-8 text-sm">
              <SelectValue placeholder="Team" />
            </SelectTrigger>
            <SelectContent className="w-[140px]">
              {teamOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
        </div>

        {/* Right Section - Sort, Active Filters & Actions */}
        <div className="flex items-center gap-3">
          {/* Sort Option */}
          {/*
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[90px] h-8 text-sm">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="w-[120px]">
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          */}

          {/* Active Filters Badge */}
          {hasActiveFilters && filterSummary && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs px-2 py-1">
                {filterSummary}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}