import { useState, useEffect } from "react";

export function useTaskFiltering(
  tasks,
  savedFilters,
  defaultFilter,
  filtersLoading,
  selectedViewId,
  setSelectedViewId,
  clearSelectedView
) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortOption, setSortOption] = useState("None");
  const [assigneeFilter, setAssigneeFilter] = useState("All");

  // Apply default filter when it's loaded
  useEffect(() => {
    if (defaultFilter && !filtersLoading) {
      const config = defaultFilter.filter_config;
      if (config) {
        setStatusFilter(config.statusFilter || "All");
        setPriorityFilter(config.priorityFilter || "All");
        setSortOption(config.sortOption || "None");
        setAssigneeFilter(config.assigneeFilter || "All");
      }
    } else if (!defaultFilter && !filtersLoading) {
      setStatusFilter("All");
      setPriorityFilter("All");
      setSortOption("None");
      setAssigneeFilter("All");
    }
  }, [defaultFilter, filtersLoading]);

  // Watch for filter changes to clear selected view
  useEffect(() => {
    if (
      statusFilter === "All" &&
      priorityFilter === "All" &&
      sortOption === "None" &&
      assigneeFilter === "All"
    ) {
      setSelectedViewId("none"); // Fix: actually call the function
      if (typeof clearSelectedView === 'function') clearSelectedView();
    }
  }, [statusFilter, priorityFilter, sortOption, assigneeFilter, setSelectedViewId, clearSelectedView]);

  // Filtering Logic
  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      statusFilter === "All" ||
      (task.status && task.status.toLowerCase() === statusFilter.toLowerCase());
    const priorityMatch =
      priorityFilter === "All" ||
      (task.priority && task.priority.toLowerCase() === priorityFilter.toLowerCase());
    const assigneeMatch =
      assigneeFilter === "All" ||
      (task.assignees &&
        Array.isArray(task.assignees) &&
        task.assignees.some((assignee) => assignee.name === assigneeFilter));
    return statusMatch && priorityMatch && assigneeMatch;
  });

  // Sorting logic (optimized)
  const priorityOrder = { high: 3, mid: 2, low: 1 };
  const sortedTasks = [...filteredTasks];
  switch (sortOption) {
    case "Due Date (Asc)":
      sortedTasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
      break;
    case "Due Date (Desc)":
      sortedTasks.sort((a, b) => new Date(b.due_date) - new Date(a.due_date));
      break;
    case "Priority (High → Low)":
      sortedTasks.sort(
        (a, b) => (priorityOrder[b.priority?.toLowerCase()] || 0) - (priorityOrder[a.priority?.toLowerCase()] || 0)
      );
      break;
    case "Priority (Low → High)":
      sortedTasks.sort(
        (a, b) => (priorityOrder[a.priority?.toLowerCase()] || 0) - (priorityOrder[b.priority?.toLowerCase()] || 0)
      );
      break;
    case "Title (A → Z)":
      sortedTasks.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      break;
    case "Title (Z → A)":
      sortedTasks.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
      break;
    case "Date Created (Newest)":
      sortedTasks.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      break;
    case "Date Created (Oldest)":
      sortedTasks.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      break;
    default:
      break;
  }

  const handleClearAll = () => {
    setStatusFilter("All");
    setPriorityFilter("All");
    setSortOption("None");
    setAssigneeFilter("All");
    setSelectedViewId("none"); // Fix: ensure view resets
    if (typeof clearSelectedView === 'function') clearSelectedView();
  };

  const handleViewSelect = async (e) => {
    const value = e.target.value;
    if (value === "none") {
      handleClearAll();
      return;
    }
    try {
      // Always compare as string
      const selectedFilter = savedFilters.find((filter) => String(filter.id) === value);
      if (!selectedFilter) return;
      const config = selectedFilter.filter_config;
      if (!config) return;
      setStatusFilter(config.statusFilter || "All");
      setPriorityFilter(config.priorityFilter || "All");
      setSortOption(config.sortOption || "None");
      setAssigneeFilter(config.assigneeFilter || "All");
      setSelectedViewId(value); // Fix: update selected view
    } catch (error) {
      console.error("Error applying view filter:", error);
    }
  };

  const hasActiveFilters =
    statusFilter !== "All" ||
    priorityFilter !== "All" ||
    assigneeFilter !== "All" ||
    sortOption !== "None";

  const currentFilterConfig = {
    statusFilter,
    priorityFilter,
    sortOption,
    assigneeFilter,
  };

  const uniqueAssignees = tasks
    .flatMap((task) => task.assignees || [])
    .filter(
      (assignee, index, self) =>
        assignee.name &&
        index === self.findIndex((a) => a.name === assignee.name)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const filterSummary = [
    statusFilter !== "All" && `Status: ${statusFilter}`,
    priorityFilter !== "All" && `Priority: ${priorityFilter}`,
    assigneeFilter !== "All" && `Assignee: ${assigneeFilter}`,
    sortOption !== "None" && `Sort: ${sortOption}`,
  ]
    .filter(Boolean)
    .join(" • ");

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
    setSelectedViewId,
    selectedViewId,
  };
}
