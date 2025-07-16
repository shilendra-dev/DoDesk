'use client'

import { useState, useEffect, useMemo } from 'react'
import { Task, TaskFilter } from '@/types/task'
import { useSavedFilterStore } from '@/stores/savedFilterStore'

export function useTaskFiltering(tasks: Task[]) {
  const { savedFilters, defaultFilter, setSelectedViewId, clearSelectedView } = useSavedFilterStore()
  
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [sortOption, setSortOption] = useState('None')
  const [assigneeFilter, setAssigneeFilter] = useState('All')

  // Apply default filter when it's loaded
  useEffect(() => {
    if (defaultFilter) {
      const config = defaultFilter.filter_config
      if (config) {
        setStatusFilter(config.statusFilter || 'All')
        setPriorityFilter(config.priorityFilter || 'All')
        setSortOption(config.sortOption || 'None')
        setAssigneeFilter(config.assigneeFilter || 'All')
      }
    } else {
      setStatusFilter('All')
      setPriorityFilter('All')
      setSortOption('None')
      setAssigneeFilter('All')
    }
  }, [defaultFilter])

  // Watch for filter changes to clear selected view
  useEffect(() => {
    if (
      statusFilter === 'All' &&
      priorityFilter === 'All' &&
      sortOption === 'None' &&
      assigneeFilter === 'All'
    ) {
      setSelectedViewId('none')
      clearSelectedView()
    }
  }, [statusFilter, priorityFilter, sortOption, assigneeFilter, setSelectedViewId, clearSelectedView])

  // Filtering Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const statusMatch =
        statusFilter === 'All' ||
        (task.status && task.status.toLowerCase() === statusFilter.toLowerCase())
      
      const priorityMatch =
        priorityFilter === 'All' ||
        (task.priority && task.priority.toLowerCase() === priorityFilter.toLowerCase())
      
      const assigneeMatch =
        assigneeFilter === 'All' ||
        (task.assignees &&
          Array.isArray(task.assignees) &&
          task.assignees.some((assignee) => assignee.name === assigneeFilter))
      
      return statusMatch && priorityMatch && assigneeMatch
    })
  }, [tasks, statusFilter, priorityFilter, assigneeFilter])

  // Sorting logic
  const sortedTasks = useMemo(() => {
    const priorityOrder = { high: 3, mid: 2, low: 1 }
    const sorted = [...filteredTasks]
    
    switch (sortOption) {
      case 'Due Date (Asc)':
        sorted.sort((a, b) => {
          const aTime = a.due_date ? new Date(a.due_date).getTime() : Infinity
          const bTime = b.due_date ? new Date(b.due_date).getTime() : Infinity
          return aTime - bTime
        })
        break
      case 'Due Date (Desc)':
        sorted.sort((a, b) => {
          const aTime = a.due_date ? new Date(a.due_date).getTime() : -Infinity
          const bTime = b.due_date ? new Date(b.due_date).getTime() : -Infinity
          return bTime - aTime
        })
        break
      case 'Priority (High → Low)':
        sorted.sort(
          (a, b) => (priorityOrder[b.priority?.toLowerCase() as keyof typeof priorityOrder] || 0) - 
                     (priorityOrder[a.priority?.toLowerCase() as keyof typeof priorityOrder] || 0)
        )
        break
      case 'Priority (Low → High)':
        sorted.sort(
          (a, b) => (priorityOrder[a.priority?.toLowerCase() as keyof typeof priorityOrder] || 0) - 
                     (priorityOrder[b.priority?.toLowerCase() as keyof typeof priorityOrder] || 0)
        )
        break
      case 'Title (A → Z)':
        sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
        break
      case 'Title (Z → A)':
        sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
        break
      case 'Date Created (Newest)':
        sorted.sort((a, b) => {
          const aTime = a.created_at ? new Date(a.created_at).getTime() : 0
          const bTime = b.created_at ? new Date(b.created_at).getTime() : 0
          return bTime - aTime
        })
        break
      case 'Date Created (Oldest)':
        sorted.sort((a, b) => {
          const aTime = a.created_at ? new Date(a.created_at).getTime() : 0
          const bTime = b.created_at ? new Date(b.created_at).getTime() : 0
          return aTime - bTime
        })
        break
      default:
        break
    }
    
    return sorted
  }, [filteredTasks, sortOption])

  const handleClearAll = () => {
    setStatusFilter('All')
    setPriorityFilter('All')
    setSortOption('None')
    setAssigneeFilter('All')
    setSelectedViewId('none')
    clearSelectedView()
  }

  const handleViewSelect = (viewId: string) => {
    if (viewId === 'none') {
      handleClearAll()
      return
    }
    
    const selectedFilter = savedFilters.find((filter) => filter.id === viewId)
    if (!selectedFilter) return
    
    const config = selectedFilter.filter_config
    if (!config) return
    
    setStatusFilter(config.statusFilter || 'All')
    setPriorityFilter(config.priorityFilter || 'All')
    setSortOption(config.sortOption || 'None')
    setAssigneeFilter(config.assigneeFilter || 'All')
    setSelectedViewId(viewId)
  }

  const hasActiveFilters =
    statusFilter !== 'All' ||
    priorityFilter !== 'All' ||
    assigneeFilter !== 'All' ||
    sortOption !== 'None'

  const currentFilterConfig: TaskFilter = {
    statusFilter,
    priorityFilter,
    sortOption,
    assigneeFilter,
  }

  const uniqueAssignees = useMemo(() => {
    return tasks
      .flatMap((task) => task.assignees || [])
      .filter(
        (assignee, index, self) =>
          assignee.name &&
          index === self.findIndex((a) => a.name === assignee.name)
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [tasks])

  const filterSummary = [
    statusFilter !== 'All' && `Status: ${statusFilter}`,
    priorityFilter !== 'All' && `Priority: ${priorityFilter}`,
    assigneeFilter !== 'All' && `Assignee: ${assigneeFilter}`,
    sortOption !== 'None' && `Sort: ${sortOption}`,
  ]
    .filter(Boolean)
    .join(' • ')

  return {
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortOption,
    setSortOption,
    assigneeFilter,
    setAssigneeFilter,
    filteredTasks: sortedTasks,
    handleViewSelect,
    handleClearAll,
    hasActiveFilters,
    currentFilterConfig,
    uniqueAssignees,
    filterSummary,
  }
}