"use client";

import { useState, useEffect, useMemo } from "react";
// import { Issue } from '@/types/issue'
import { useSavedFilterStore } from "@/stores/savedFilterStore";
import { useIssueStore } from "@/stores/issueStore";

export function useIssueFiltering() {
  const { defaultFilter, setSelectedViewId, clearSelectedView } =
    useSavedFilterStore();
  const issues = useIssueStore((state) => state.issues);

  const [stateFilter, setStateFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortOption, setSortOption] = useState("None");
  const [assigneeFilter, setAssigneeFilter] = useState("All");

  // Apply default filter when it's loaded
  useEffect(() => {
    if (defaultFilter) {
      const config = defaultFilter.filter_config;
      if (config) {
        setStateFilter(config.stateFilter || "All");
        setPriorityFilter(config.priorityFilter || "All");
        setSortOption(config.sortOption || "None");
        setAssigneeFilter(config.assigneeFilter || "All");
      }
    } else {
      setStateFilter("All");
      setPriorityFilter("All");
      setSortOption("None");
      setAssigneeFilter("All");
    }
  }, [defaultFilter]);

  // Watch for filter changes to clear selected view
  useEffect(() => {
    if (
      stateFilter === "All" &&
      priorityFilter === 'All' &&
      sortOption === 'None' &&
      assigneeFilter === 'All'
    ) {
      setSelectedViewId('none')
      clearSelectedView()
    }
  }, [
    stateFilter,
    priorityFilter,
    sortOption,
    assigneeFilter,
    setSelectedViewId,
    clearSelectedView
  ])

  // Filtering logic
  const filteredIssues = useMemo(() => {
    let filtered = Object.values(issues)
    if (stateFilter !== 'All') filtered = filtered.filter(issue => issue.state === stateFilter)
    if (priorityFilter !== "All")
      filtered = filtered.filter((issue) => String(issue.priority) === priorityFilter)
    if (assigneeFilter !== "All")
      filtered = filtered.filter((issue) => issue.assigneeId === assigneeFilter)
    // Add sorting logic if needed
    return filtered
  }, [issues, stateFilter, priorityFilter, assigneeFilter])

  const clearAllFilters = () => {
    setStateFilter('All')
    setPriorityFilter('All')
    setSortOption('None')
    setAssigneeFilter('All')
  }
  const hasActiveFilters =
    stateFilter !== 'All' ||
    priorityFilter !== 'All' ||
    sortOption !== 'None' ||
    assigneeFilter !== 'All' ||
    filteredIssues.length > 0;

    const filterSummary = [
      stateFilter !== 'All' ? `State: ${stateFilter}` : null,
      priorityFilter !== 'All' ? `Priority: ${priorityFilter}` : null,
      assigneeFilter !== 'All' ? `Assignee: ${assigneeFilter}` : null,
      sortOption !== 'None' ? `Sort: ${sortOption}` : null,
    ]
      .filter(Boolean)
      .join(', ');

  return {
    stateFilter,
    setStateFilter,
    priorityFilter,
    setPriorityFilter,
    sortOption,
    setSortOption,
    assigneeFilter,
    setAssigneeFilter,
    filteredIssues,
    clearAllFilters,
    hasActiveFilters,
    filterSummary
  }
}
