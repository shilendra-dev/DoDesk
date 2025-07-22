'use client'

import React, { useMemo, useState } from 'react'
import { X, Save } from 'lucide-react'
import { Button } from '@/components/ui/atoms/button'
import { Badge } from '@/components/ui/atoms/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from  '@/components/ui/atoms/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/organisms/dialog'
import { Input } from '@/components/ui/atoms/input'
import { Label } from '@/components/ui/atoms/label'
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

  // Assignee options (single assignee per issue)
  const assigneeOptions = useMemo(() => [
    { value: "All", label: "All" },
    ...issues
      .map(issue => issue.assignee)
      .filter(assignee => assignee?.name)
      .filter((assignee, idx, self) =>
        idx === self.findIndex(a => a?.name === assignee?.name)
      )
      .map(assignee => ({ value: assignee!.name!, label: assignee!.name! }))
  ], [issues])

  // Team options
  const teamOptions = [
    { value: "All", label: "All" },
    ...teams.map(team => ({ value: team.id, label: team.name }))
  ]

  // Priority options (integer-based)
  const priorityOptions = [
    { value: "All", label: "All" },
    { value: "1", label: "Urgent" },
    { value: "2", label: "High" },
    { value: "3", label: "Medium" },
    { value: "4", label: "Low" },
    { value: "0", label: "None" }
  ]

  // State options (schema-based)
  const stateOptions = [
    { value: "All", label: "All" },
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
    <div className="border-b border-border p-4 bg-50">
      <div className="flex items-center justify-between">
        {/* Filter Controls */}
        <div className="flex items-center gap-4">
          {/* Saved Views */}
          <Select value={selectedViewId} onValueChange={handleViewSelect}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All issues</SelectItem>
              {savedFilters.map((filter) => (
                <SelectItem key={filter.id} value={filter.id}>
                  {filter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filter Controls */}
          <div className="flex items-center gap-2">
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                {stateOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                {assigneeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={teamFilter} onValueChange={setTeamFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent>
                {teamOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Sort */}
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {filterSummary}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-6 w-6 p-0"
              >
                <X size={12} />
              </Button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Save size={14} />
                  Save View
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Filter View</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="filterName">View Name</Label>
                    <Input
                      id="filterName"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      placeholder="Enter view name"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowSaveDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveFilter}
                      disabled={!filterName.trim()}
                    >
                      Save View
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {selectedViewId !== 'none' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteView}
              className="text-destructive hover:text-destructive"
            >
              Delete View
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}