import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import TaskColumn from './components/TaskColumn';
import TaskDetails from './TaskDetails';
import TaskFilterBar from './components/TaskFilterBar';
import { useTaskContext } from '../../providers/TaskContext';
import { useWorkspace } from '../../providers/WorkspaceContext';
import { SavedFilterContext } from '../../providers/SavedFilterContext';
import { updateTask } from '../../features/tasks/taskApi';
import { toast } from 'react-hot-toast';
import { useTaskFiltering } from '../../shared/hooks/useTaskFiltering';
import { statusOptions, priorityOptions, sortOptions } from './constants/taskOptions';
import { useSaveFilterModal } from './hooks/useSaveFilterModal';

const COLUMNS = {
  PENDING: {
    id: 'pending',
    title: 'Pending',
    color: 'yellow',
  },
  IN_PROGRESS: {
    id: 'in-progress',
    title: 'In Progress',
    color: 'black',
  },
  COMPLETED: {
    id: 'completed',
    title: 'Completed',
    color: 'green',
  },
};

function TaskBoardView() {
  const { tasks, setTasks } = useTaskContext();
  const [selectedTask, setSelectedTask] = useState(null);
  const { selectedWorkspace } = useWorkspace();

  // Use SavedFilterContext for all filter state and actions
  const { 
    savedFilters, 
    defaultFilter, 
    selectedViewId, 
    loading: filtersLoading, 
    fetchSavedFilters, 
    createFilter, 
    removeFilter, 
    setSelectedViewId, 
    clearSelectedView 
  } = useContext(SavedFilterContext);

  // useSaveFilterModal hook manages save filter modal state and actions
  const { 
    showSaveFilterModal, 
    setShowSaveFilterModal, 
    newFilterName, 
    setNewFilterName 
  } = useSaveFilterModal();



  // Load saved filters on workspace change
  useEffect(() => {
    if (selectedWorkspace?.id) {
      fetchSavedFilters(selectedWorkspace.id).catch(error => {
        console.error("Error fetching saved filters:", error);
        toast.error("Failed to load saved filters");
      });
    }
  }, [selectedWorkspace?.id, fetchSavedFilters]);

  // useTaskFiltering hook handles all filtering logic
  const { 
    statusFilter, 
    setStatusFilter, 
    priorityFilter, 
    setPriorityFilter, 
    sortOption, 
    setSortOption, 
    assigneeFilter, 
    setAssigneeFilter, 
    filteredTasks, 
    handleClearAll, 
    handleViewSelect, 
    hasActiveFilters, 
    currentFilterConfig, 
    uniqueAssignees, 
    filterSummary 
  } = useTaskFiltering(tasks, savedFilters, defaultFilter, filtersLoading, clearSelectedView, setSelectedViewId, selectedViewId);

  // Configure filter options for the filter bar
  const filterConfigs = useMemo(() => [
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
  ], [statusFilter, setStatusFilter, priorityFilter, setPriorityFilter, assigneeFilter, setAssigneeFilter, uniqueAssignees]);

  // Handle saving a new filter
  const handleSaveFilter = useCallback(async () => {
    if (!newFilterName.trim()) return;
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
      toast.error("Error saving filter");
    }
  }, [newFilterName, currentFilterConfig, selectedWorkspace?.id, createFilter, setShowSaveFilterModal, setNewFilterName]);

  // Handle deleting a filter view
  const handleDeleteView = useCallback(async () => {
    try {
      await removeFilter(selectedWorkspace.id, selectedViewId);
      toast.success("Filter deleted successfully");
    } catch (error) {
      toast.error("Error deleting filter");
      console.error("Error deleting filter:", error);
    }
  }, [selectedWorkspace?.id, selectedViewId, removeFilter]);

  // Group filtered tasks by status
  const groupedTasks = useMemo(() => {
    return filteredTasks.reduce((acc, task) => {
      const status = task.status.toLowerCase();
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(task);
      return acc;
    }, {});
  }, [filteredTasks]);

  // Handle drag end
  const handleDragEnd = useCallback(async (result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside droppable area, do nothing
    if (!destination) return;

    // If dropped in the same position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    try {
      // Finding task being dragged
      const task = tasks.find((t) => t.id === draggableId);
      if (!task) return;

      // Update task status
      const updatedTask = {
        ...task,
        status: destination.droppableId,
      };

      await updateTask(task.id, updatedTask);

      // Updating local state
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
      );

      toast.success('Task status updated');
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  }, [tasks, setTasks]);

  // Grouped props for TaskFilterBar
  const filterBarProps = useMemo(() => ({ 
    filterConfigs, 
    statusFilter, 
    priorityFilter, 
    assigneeFilter, 
    sortOption, 
    setSortOption, 
    sortOptions, 
    selectedViewId, 
    savedFilters, 
    handleViewSelect, 
    hasActiveFilters, 
    filterSummary, 
    showSaveFilterModal, 
    setShowSaveFilterModal, 
    newFilterName, 
    setNewFilterName, 
    handleSaveFilter, 
    handleDeleteView, 
    handleClearAll 
  }), [filterConfigs, statusFilter, priorityFilter, assigneeFilter, sortOption, setSortOption, sortOptions, selectedViewId, savedFilters, handleViewSelect, hasActiveFilters, filterSummary, showSaveFilterModal, setShowSaveFilterModal, newFilterName, setNewFilterName, handleSaveFilter, handleDeleteView, handleClearAll]);

  return (
    <div className="h-full flex flex-col relative overflow-visible">
      {/* Use TaskFilterBar component instead of custom filter UI */}
      <TaskFilterBar {...filterBarProps} />

      {/* Task Columns */}
      <div className="overflow-visible flex-1">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="relative flex flex-1 overflow-visible gap-3 pb-2 pl-3 pr-3 bg-[var(--color-bg)] min-w-fit">
            {Object.values(COLUMNS).map((column) => (
              <TaskColumn
                key={column.id}
                column={column}
                tasks={groupedTasks[column.id] || []} // Pass filtered and sorted tasks
                onTaskSelect={setSelectedTask}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
      
      {selectedTask && (
        <TaskDetails task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}

export default TaskBoardView;