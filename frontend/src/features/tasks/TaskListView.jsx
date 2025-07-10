import { useState, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import { useWorkspace } from "../../providers/WorkspaceContext";
import { SavedFilterContext } from "../../providers/SavedFilterContext";
import TaskDetails from "../../features/tasks/TaskDetails";
import { toast } from "react-hot-toast";
import { useTaskFiltering } from "../../shared/hooks/useTaskFiltering";
import { useInlineEdit } from "../../shared/hooks/useInlineEdit";
import { statusOptions, priorityOptions, sortOptions } from "./constants/taskOptions";
import { useTooltip } from "../../shared/hooks/useTooltip";
import InlineDropdown from "../../shared/components/molecules/InlineDropdown";
import TaskFilterBar from "./components/TaskFilterBar";
import TaskTable from "./components/TaskTable";
import Pagination from "./components/Pagination";
import Tooltip from "../../shared/components/atoms/Tooltip";
import { usePagination } from "../../shared/hooks/usePagination";
import { useSaveFilterModal } from "./hooks/useSaveFilterModal";
import { useDropdown } from "./hooks/useDropdown";
import { useTaskContext } from "../../providers/TaskContext"; // Custom hook to access task context

function TaskListView() {
  const {tasks, setTasks} = useTaskContext();
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const { selectedWorkspace } = useWorkspace();

  // useTooltip hook manages tooltip state and actions
  const { tooltip, showTooltip, hideTooltip } = useTooltip();

  // useInlineEdit hook manages inline editing state and actions
  const { editingTaskId, setEditingTaskId, editingField, setEditingField, editedTitle, setEditedTitle, handleInlineEdit } = useInlineEdit(tasks, setTasks);

  // Use SavedFilterContext for all filter state and actions
  const { savedFilters, defaultFilter, selectedViewId, loading: filtersLoading, fetchSavedFilters, createFilter, removeFilter, setSelectedViewId, clearSelectedView } = useContext(SavedFilterContext);

  // useSaveFilterModal hook manages save filter modal state and actions
  const { showSaveFilterModal, setShowSaveFilterModal, newFilterName, setNewFilterName} = useSaveFilterModal();

  // useDropdown hook manages dropdown state and actions
  const { dropdownPosition, dropdownType, setDropdownPosition, setDropdownType } = useDropdown();

  // Load saved filters on workspace change
  useEffect(() => {
    if (selectedWorkspace?.id) {
      fetchSavedFilters(selectedWorkspace.id);
    }
  }, [selectedWorkspace?.id, fetchSavedFilters]);

  // useTaskFiltering hook handles all filtering logic
  const { statusFilter, setStatusFilter, priorityFilter, setPriorityFilter, sortOption, setSortOption, assigneeFilter, setAssigneeFilter, filteredTasks, handleClearAll, handleViewSelect, hasActiveFilters, currentFilterConfig, uniqueAssignees, filterSummary } = useTaskFiltering(tasks, savedFilters, defaultFilter, filtersLoading, clearSelectedView, setSelectedViewId, selectedViewId);

  // Configure filter options for the filter bar
  const filterConfigs = [
    {
      label: "Status",
      id: "statusFilter",
      value: statusFilter,
      onChange: (e) => setStatusFilter(e.target.value),
      options: statusOptions,
    },
    {
      label: "Priority",
      id: "priorityFilter",
      value: priorityFilter,
      onChange: (e) => setPriorityFilter(e.target.value),
      options: priorityOptions,
    },
    {
      label: "Assignee",
      id: "assigneeFilter",
      value: assigneeFilter,
      onChange: (e) => setAssigneeFilter(e.target.value),
      options: uniqueAssignees.map((a) => ({ value: a.name, label: a.name })),
    },
  ];

  // Handle saving a new filter
  const handleSaveFilter = async () => {
    if (!newFilterName.trim()) return;
    setLoading(true);
    try {
      const filterConfig = currentFilterConfig;
      const filterData = {
        name: newFilterName.trim(),
        filter_config: filterConfig,
      };
      await createFilter(selectedWorkspace.id, filterData);
      setShowSaveFilterModal(false);
      setNewFilterName("");
    } catch (error) {
      console.error("Error saving filter:", error);
    }
  };

  // Handle deleting a filter view
  const handleDeleteView = async () => {
    setLoading(true);
    try {
      await removeFilter(selectedWorkspace.id, selectedViewId);
      toast.success("Filter deleted successfully");
    } catch (error) {
      toast.error("Error deleting filter");
      console.error("Error deleting filter:", error);
    }
  };

  // Pagination setup
  const tasksPerPage = 15;
  const { currentPage, setCurrentPage, totalPages, currentItems: currentTasks } = usePagination(filteredTasks, tasksPerPage);

  // Grouped props for TaskFilterBar
  const filterBarProps = { filterConfigs, statusFilter, priorityFilter, assigneeFilter, sortOption, setSortOption, sortOptions, selectedViewId, savedFilters, handleViewSelect, hasActiveFilters, filterSummary, showSaveFilterModal, setShowSaveFilterModal, newFilterName, setNewFilterName, handleSaveFilter, handleDeleteView, handleClearAll };

  // Grouped props for TaskTable
  const taskTableProps = { tasks: currentTasks, editingTaskId, editingField, editedTitle, setEditingTaskId, setEditingField, setEditedTitle, handleInlineEdit, showTooltip, hideTooltip, setSelectedTask, setDropdownPosition, setDropdownType };

  return (
    <div
      className="h-full flex flex-col"
      onClick={() => setDropdownPosition(null)}
    >
      <div className="overflow-auto flex-1 flex flex-col border border-transparent relative z-0">
        <div className="max-h-fit overflow-y-auto flex flex-col border border-transparent relative z-0">
          {loading && (
            <div className="text-center py-4 text-gray-500">
              <span>Loading...</span>
            </div>
          )}

          {/*filter view section */}
          <TaskFilterBar {...filterBarProps} />
          {/* Task table - main content area */}
          <TaskTable {...taskTableProps} />
          {/* Pagination - sticky inside scroll container */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <TaskDetails
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      </div>

      {/* Tooltip for task details */}
      <Tooltip
        visible={tooltip.visible}
        x={tooltip.x}
        y={tooltip.y}
        content={tooltip.name}
      />
      {dropdownPosition &&
        editingTaskId &&
        createPortal(
          <InlineDropdown
            type={dropdownType}
            position={dropdownPosition}
            onSelect={(option) =>
              handleInlineEdit(editingTaskId, dropdownType, option.value)
            }
            options={
              dropdownType === "status"
                ? statusOptions
                : dropdownType === "priority"
                ? priorityOptions
                : []
            }
            onClose={() => {
              setEditingTaskId(null);
              setEditingField(null);
              setDropdownPosition(null);
            }}
          />,
          document.body
        )}
    </div>
  );
}
export default TaskListView;
