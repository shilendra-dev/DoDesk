'use client'

import React, { useState } from 'react'
import { X, Save } from 'lucide-react'
import { Button } from '@/components/ui/atoms/button'
import { Badge } from '@/components/ui/atoms/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/molecules/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/organisms/dialog'
import { Input } from '@/components/ui/atoms/input'
import { Label } from '@/components/ui/atoms/label'
import { useSavedFilterStore } from '@/stores/savedFilterStore'
import { useWorkspace } from '@/providers/WorkspaceContext'
// import { cn } from '@/lib/utils'

interface FilterConfig {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}

interface TaskFilterBarProps {
  filterConfigs: FilterConfig[]
  sortOption: string
  setSortOption: (option: string) => void
  sortOptions: { value: string; label: string }[]
  hasActiveFilters: boolean
  filterSummary: string
  onClearAll: () => void
}

export function TaskFilterBar({
  filterConfigs,
  sortOption,
  setSortOption,
  sortOptions,
  hasActiveFilters,
  filterSummary,
  onClearAll
}: TaskFilterBarProps) {
  const { currentWorkspace } = useWorkspace()
  const { savedFilters, selectedViewId, createFilter, deleteFilter, setSelectedViewId } = useSavedFilterStore()
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [filterName, setFilterName] = useState('')

  const handleSaveFilter = async () => {
    if (!filterName.trim() || !currentWorkspace?.id) return

    const filterConfig = {
      statusFilter: filterConfigs.find(f => f.id === 'statusFilter')?.value || 'All',
      priorityFilter: filterConfigs.find(f => f.id === 'priorityFilter')?.value || 'All',
      assigneeFilter: filterConfigs.find(f => f.id === 'assigneeFilter')?.value || 'All',
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
            {filterConfigs.map((config) => (
              <Select key={config.id} value={config.value} onValueChange={config.onChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder={config.label} />
                </SelectTrigger>
                <SelectContent>
                  {config.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}

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