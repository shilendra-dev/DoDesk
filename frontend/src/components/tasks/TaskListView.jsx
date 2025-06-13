import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import BadgeLabel from "../atoms/BadgeLabel";
import { updateTask } from "../../api/taskApi";
import { useWorkspace } from "../../context/WorkspaceContext";
import axios from "axios";
import { SquareLibrary } from "lucide-react";
import TaskDetails from "./TaskDetails";
import { useSavedFilters } from '../../hooks/useSavedFilters';
import { Save, Trash2, Star, Filter } from 'lucide-react';

const formatDateLocal = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function TaskListView({ tasks, setTasks }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading] = useState(false);
  const { selectedWorkspace } = useWorkspace();
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 15;

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  // Dropdown state for inline status/priority dropdowns
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const [dropdownType, setDropdownType] = useState(null);

  //states for sorting and filtering logic
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortOption, setSortOption] = useState("None");
  const [assigneeFilter, setAssigneeFilter] = useState("All");

  //states for saved filters
  const { 
    savedFilters, 
    defaultFilter,
    selectedViewId,
    loading: filtersLoading,
    fetchSavedFilters,
    createFilter, 
    removeFilter, 
    makeDefault,
    clearSelectedView
  } = useSavedFilters();
  const [showSaveFilterModal, setShowSaveFilterModal] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');

  //load saved filters on mount'setDefaultFilter' is declared but its value is never read.
  useEffect(() => {
    if(selectedWorkspace?.id){
      fetchSavedFilters(selectedWorkspace.id);
    }
  }, [selectedWorkspace?.id, fetchSavedFilters]);

  // Apply default filter when it's loaded
  useEffect(() => {
    if (defaultFilter && !filtersLoading) {
      const config = defaultFilter.filter_config;
      if (config) {
        setStatusFilter(config.statusFilter || 'All');
        setPriorityFilter(config.priorityFilter || 'All');
        setSortOption(config.sortOption || 'None');
        setAssigneeFilter(config.assigneeFilter || 'All');
      }
    }
  }, [defaultFilter, filtersLoading]);

  // Watch for filter changes to clear selected view
  useEffect(() => {
    if (selectedViewId !== 'none') {
      const selectedFilter = savedFilters.find(filter => filter.id === selectedViewId);
      if (selectedFilter) {
        const config = selectedFilter.filter_config;
        const filtersMatch = 
          config.statusFilter === statusFilter &&
          config.priorityFilter === priorityFilter &&
          config.sortOption === sortOption &&
          config.assigneeFilter === assigneeFilter;

        if (!filtersMatch) {
          clearSelectedView();
        }
      }
    }
  }, [statusFilter, priorityFilter, sortOption, assigneeFilter, savedFilters, selectedViewId, clearSelectedView]);

  const handleClearAll = () => {
    setStatusFilter('All');
    setPriorityFilter('All');
    setSortOption('None');
    setAssigneeFilter('All');
    clearSelectedView();
    fetchTasks();
  };

  const handleViewSelect = async (e) => {
    const value = e.target.value;
    
    if (value === 'none') {
      setStatusFilter('All');
      setPriorityFilter('All');
      setSortOption('None');
      setAssigneeFilter('All');
      clearSelectedView();
      return;
    }

    try {
      const selectedFilter = savedFilters.find(filter => filter.id === value);
      if (!selectedFilter) return;

      const config = selectedFilter.filter_config;
      if (!config) return;

      // Apply the saved filter configuration
      setStatusFilter(config.statusFilter || 'All');
      setPriorityFilter(config.priorityFilter || 'All');
      setSortOption(config.sortOption || 'None');
      setAssigneeFilter(config.assigneeFilter || 'All');

      // Make the selected view the default
      await makeDefault(selectedWorkspace.id, value);

      // Refresh tasks with new filters
      await fetchTasks();
    } catch (error) {
      console.error('Error applying saved filter:', error);
    }
  };

  const handleSaveFilter = async () => {
    if (!newFilterName.trim()) {
      return;
    }

    try {
      const filterConfig = {
        statusFilter,
        priorityFilter,
        sortOption,
        assigneeFilter
      };
      
      const filterData = {
        name: newFilterName.trim(),
        filter_config: JSON.stringify(filterConfig) 
      };
      
      await createFilter(selectedWorkspace.id, filterData);
      await makeDefault(selectedWorkspace.id, selectedViewId);
      
      setShowSaveFilterModal(false);
      setNewFilterName('');
    } catch (error) {
      console.error('Error saving filter:', error);
    }
  };

  const renderFilterView = () => {
    const hasActiveFilters = statusFilter !== 'All' || 
      priorityFilter !== 'All' || 
      assigneeFilter !== 'All' || 
      sortOption !== 'None';

    return (
      <>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#101221]/60 backdrop-blur border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            {hasActiveFilters ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {statusFilter !== 'All' && `Status: ${statusFilter}`}
                  {priorityFilter !== 'All' && ` • Priority: ${priorityFilter}`}
                  {assigneeFilter !== 'All' && ` • Assignee: ${assigneeFilter}`}
                  {sortOption !== 'None' && ` • Sort: ${sortOption}`}
                </span>
                {selectedViewId === 'none' ? (
                  <button
                    onClick={() => setShowSaveFilterModal(true)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors"
                    title="Save this view"
                  >
                    <Save size={12} />
                    Save View
                  </button>
                ) : (
                  <button
                    onClick={() => removeFilter(selectedWorkspace.id, selectedViewId)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors"
                    title="Delete selected view"
                  >
                    <Trash2 size={12} />
                    Delete View
                  </button>
                )}
              </div>
            ) : (
              <span className="text-xs text-gray-400 italic">
                No filters applied
              </span>
            )}
          </div>

          {/* Saved Views Dropdown */}
          {savedFilters && savedFilters.length > 0 && (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-gray-400">View:</span>
              <select
                onChange={handleViewSelect}
                value={selectedViewId}
                className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-xs text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="none">None</option>
                {savedFilters.map(filter => (
                  <option key={filter.id} value={filter.id}>
                    {filter.name}
                    {defaultFilter?.id === filter.id && ' (Default)'}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Save View Modal */}
        {showSaveFilterModal && createPortal(
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="bg-gray-800 rounded-lg p-6 w-96 shadow-xl">
              <h3 className="text-lg font-medium text-gray-100 mb-4">Save Current View</h3>
              <input
                type="text"
                value={newFilterName}
                onChange={(e) => setNewFilterName(e.target.value)}
                placeholder="Enter view name"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => {
                    setShowSaveFilterModal(false);
                    setNewFilterName('');
                  }}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveFilter}
                  disabled={!newFilterName.trim()}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  };

  //Filtering Logic
  let filteredTasks = tasks.filter(task => {
    const statusMatch = statusFilter === "All" || task.status.toLowerCase() === statusFilter.toLowerCase();
    const priorityMatch = priorityFilter === "All" || task.priority.toLowerCase() === priorityFilter.toLowerCase();
    const assigneeMatch = assigneeFilter === "All" || 
      (task.assignees && Array.isArray(task.assignees) && 
      task.assignees.some(assignee => assignee.name === assigneeFilter));
    return statusMatch && priorityMatch && assigneeMatch;
  })

  // Sorting logic (extended)
  const priorityOrder = { high: 3, mid: 2, low: 1 };
  switch (sortOption) {
    case "Due Date (Asc)":
      filteredTasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
      break;
    case "Due Date (Desc)":
      filteredTasks.sort((a, b) => new Date(b.due_date) - new Date(a.due_date));
      break;
    case "Priority (High → Low)":
      filteredTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      break;
    case "Priority (Low → High)":
      filteredTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      break;
    case "Title (A → Z)":
      filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "Title (Z → A)":
      filteredTasks.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case "Date Created (Newest)":
      filteredTasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
    case "Date Created (Oldest)":
      filteredTasks.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      break;
    default:
      break;
  }

  const [tooltip, setTooltip] = useState({ visible: false, name: "", x: 0, y: 0 });

  const showTooltip = (name, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      name,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  const hideTooltip = () => {
    setTooltip({ visible: false, name: "", x: 0, y: 0 });
  };

  //Pagination Logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5033/api/tasks/${selectedWorkspace.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  // Generic API handler for updating any task field
  const handleTaskFieldUpdate = async (taskId, field, value) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;

      const updatedTask = {
        ...taskToUpdate,
        [field]: value
      };

      await updateTask(taskId, updatedTask);
      await fetchTasks();
    } catch (err) {
      console.error(`Failed to update task ${field}:`, err);
    }
  };

  // Inline edit handler for task fields
  const handleInlineEdit = async (taskId, field, value) => {
    await handleTaskFieldUpdate(taskId, field, value);
    setEditingTaskId(null);
    setEditingField(null);
  };

  return (
    <div className="h-full flex flex-col" onClick={() => setDropdownPosition(null)}>
      <div className="overflow-auto flex-1 flex flex-col">
        <div className="max-h-[620px] overflow-y-auto flex flex-col border border-transparent relative z-0">
          {loading && (
            <div className="text-center py-4 text-gray-500">
              <span>Loading...</span>
            </div>
          )}

          {/* Add the filter view section */}
          {renderFilterView()}

          <div className="flex justify-between items-center flex-wrap gap-4 px-4 py-3 bg-[#101221]/60 backdrop-blur">
            <div className="flex gap-4 items-center">
              {/* Status Filter */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <label htmlFor="statusFilter" className="text-sm font-medium text-gray-300">Status</label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-xs text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option>All</option>
                  <option>Pending</option>
                  <option>In-Progress</option>
                  <option>Completed</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <label htmlFor="priorityFilter" className="text-sm font-medium text-gray-300">Priority</label>
                <select
                  id="priorityFilter"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-xs text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option>All</option>
                  <option>High</option>
                  <option>Mid</option>
                  <option>Low</option>
                </select>
              </div>

              {/* Assignee Filter */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <label htmlFor="assigneeFilter" className="text-sm font-medium text-gray-300">Assignee</label>
                <select
                  id="assigneeFilter"
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-xs text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option>All</option>
                  {tasks
                    .flatMap(task => task.assignees || [])
                    .filter((assignee, index, self) => 
                      assignee.name && index === self.findIndex(a => a.name === assignee.name)
                    )
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(assignee => (
                      <option key={assignee.name} value={assignee.name}>
                        {assignee.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Sort Option */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <label htmlFor="sortOption" className="text-sm font-medium text-gray-300">Sort by</label>
                <select
                  id="sortOption"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-xs text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option>None</option>
                  <option>Due Date (Asc)</option>
                  <option>Due Date (Desc)</option>
                  <option>Priority (High → Low)</option>
                  <option>Priority (Low → High)</option>
                  <option>Title (A → Z)</option>
                  <option>Title (Z → A)</option>
                  <option>Date Created (Newest)</option>
                  <option>Date Created (Oldest)</option>
                </select>
              </div>

              {/* Clear Button - Shows when any filter or sort is applied */}
              {(statusFilter !== 'All' || 
                priorityFilter !== 'All' || 
                assigneeFilter !== 'All' || 
                sortOption !== 'None' || 
                selectedViewId !== 'none') && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors"
                  title="Clear all filters and view"
                >
                  <Trash2 size={12} />
                  Clear
                </button>
              )}
            </div>
          </div>

          <table className="w-auto bg-[#101221]/50 backdrop-blur-md shadow-md">
            {/* Table Header */}
            <thead className="sticky top-0 z-10 bg-[#090E12]/90 backdrop-blur-md border-b border-b-gray-800 text-gray-100 text-left text-sm">
            <tr>
              <th className="px-5 py-2 text-left align-middle">Title</th>
              <th className="px-3 py-2 text-left align-middle">Description</th>
              <th className="px-3 py-2 text-center align-middle">Assignees</th>
              <th className="px-3 py-2 text-center align-middle">Status</th>
              <th className="px-3 py-2 text-center align-middle">Priority</th>
              <th className="px-2 py-2 pl-6 text-left align-middle">Due Date</th>
              <th className="px-3 py-2 text-left align-middle whitespace-nowrap">Created By</th>
              <th className="px-3 py-2 text-left align-middle whitespace-nowrap">Created On</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {Array.isArray(tasks) && tasks.length > 0 ? (
              currentTasks.map((task) => (
                <tr
                  key={task.id}
                  className="group border-b border-b-gray-800 hover:bg-[#090E12] text-sm text-gray-200 bg-[#101221]/30 backdrop-blur-sm py-2 transition-all duration-200 overflow-visible transform hover:scale-[1.01]"
                >
                  <td className="px-3 py-2 text-left align-middle">
                    <div className="flex justify-between items-center gap-2 group-hover:opacity-100">
                      {/* Editable Task Title */}
                      {editingTaskId === task.id && editingField === "title" ? (
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          onBlur={() => handleInlineEdit(task.id, "title", editedTitle)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleInlineEdit(task.id, "title", editedTitle);
                          }}
                          className="bg-transparent  text-white text-sm rounded w-full focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <>
                          <span
                            className="text-gray-200 cursor-pointer ml-2"
                            onClick={() => {
                              setEditingTaskId(task.id);
                              setEditedTitle(task.title);
                              setEditingField("title");
                            }}
                          >
                            {task.title}
                          </span>
                          <SquareLibrary
                            size={16}
                            className="text-gray-400 opacity-0 group-hover:opacity-100 transform transition-all duration-150 ease-in-out scale-100 group-hover:scale-125 cursor-pointer ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTask(task);
                            }}
                          />
                        </>
                      )}
                    </div>
                  </td>
                  
                  {/* Editable Task Description */}
                  <td className="px-3 py-2 text-left align-middle">
                    {editingTaskId === task.id && editingField === "description" ? (
                      <input
                        type="text"
                        value={task.description || ""}
                        onChange={(e) =>
                          setTasks((prevTasks) =>
                            prevTasks.map((t) =>
                              t.id === task.id ? { ...t, description: e.target.value } : t
                            )
                          )
                        }
                        onBlur={() => {
                          handleInlineEdit(task.id, "description", task.description);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleInlineEdit(task.id, "description", task.description);
                        }}
                        className="bg-transparent px-2 py-1 text-white text-sm rounded w-full focus:outline-none whitespace-nowrap overflow-hidden text-ellipsis"
                        autoFocus
                        maxLength={100}
                      />
                    ) : (
                      <span
                        className="text-gray-300 cursor-pointer max-w-[250px] truncate block whitespace-nowrap overflow-hidden"
                        onClick={() => {
                          setEditingTaskId(task.id);
                          setEditingField("description");
                        }}
                      >
                        {task.description || "-"}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center align-middle flex justify-center">
                    <div className="flex items-center -space-x-2">
                      {task.assignees &&
                      Array.isArray(task.assignees) &&
                      task.assignees.length > 0 ? (
                        <>
                          {task.assignees.slice(0, 3).map((assignee, index) => (
                            <div
                              key={index}
                              className="relative group"
                              style={{ zIndex: task.assignees.length - index }}
                            >
                              <div
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center ring-2 ring-gray-900 shadow-lg hover:scale-105 transition-transform duration-150"
                                title={assignee.name}
                                onMouseEnter={(e) => showTooltip(assignee.name, e)}
                                onMouseLeave={hideTooltip}
                              >
                                {assignee.name?.substring(0, 2).toUpperCase()}
                              </div>
                            </div>
                          ))}
                          {task.assignees.length > 3 && (
                            <div
                              className="relative group"
                              style={{ zIndex: 0 }}
                              onMouseEnter={(e) =>
                                showTooltip(
                                  task.assignees
                                    .slice(3)
                                    .map((assignee) => assignee.name)
                                    .join(", "),
                                  e
                                )
                              }
                              onMouseLeave={hideTooltip}
                            >
                              <div
                                className="w-8 h-8 rounded-full bg-gray-600 text-white text-xs font-bold flex items-center justify-center ring-2 ring-gray-900 shadow-lg"
                                title={`${task.assignees.length - 3} more`}
                              >
                                +{task.assignees.length - 3}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div
                          className="w-8 h-8 rounded-full bg-red-800 text-white text-xs font-bold flex items-center justify-center ring-2 ring-gray-900 shadow-lg"
                          title="Not Assigned"
                        >
                          NA
                        </div>
                      )}

                    </div>
                  </td>
                  <td className="px-3 py-2 text-center align-middle whitespace-nowrap relative">
                    <div className="relative inline-block text-left">
                      <div
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          setEditingTaskId(task.id);
                          setEditingField("status");
                          setDropdownPosition({ x: rect.left, y: rect.bottom });
                          setDropdownType("status");
                        }}
                      >
                        <BadgeLabel type="status" value={String(task.status).toLowerCase()} />
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center align-middle relative">
                    <div className="relative inline-block text-left">
                      <div
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          setEditingTaskId(task.id);
                          setEditingField("priority");
                          setDropdownPosition({ x: rect.left, y: rect.bottom });
                          setDropdownType("priority");
                        }}
                      >
                        <BadgeLabel type="priority" value={String(task.priority).toLowerCase()} />
                      </div>
                    </div>
                  </td>   

                  {/* Editable Due Date */} 
                  <td className="px-3 py-2 text-center align-middle ">
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      defaultValue={task.due_date ? formatDateLocal(task.due_date) : ""}
                      onChange={(e) => handleInlineEdit(task.id, "due_date", e.target.value)}
                      className="bg-transparent text-white text-sm rounded focus:outline-none px-2 py-1 cursor-pointer appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                      onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                    />
                  </td>
                  
                  <td className="px-3 py-2 text-left align-middle whitespace-nowrap">
                    {task.created_by_name || "—"}
                  </td>
                  <td className="px-3 py-2 text-left align-middle whitespace-nowrap">
                    {new Date(task.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-2 text-gray-500">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
          </table>
          
        {/* Pagination - sticky inside scroll container */}
        <div className="sticky bottom-0 left-0 w-full bg-[#101221]/90 backdrop-blur-sm pt-2 pb-2 flex justify-center items-center space-x-2 text-sm text-gray-200 z-10 border-t border-gray-700">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-gray-600 bg-[#86909f] hover:bg-[#374151] transition disabled:opacity-30"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded-md border border-gray-600 transition ${
                currentPage === index + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-[#1f2937] hover:bg-[#374151]"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-gray-600 bg-[#1f2937] hover:bg-[#374151] transition disabled:opacity-30"
          >
            Next
          </button>
        </div>
        </div>
        <TaskDetails
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          tasks={tasks}
          setTasks={setTasks}
        />
      </div>
      {tooltip.visible &&
        createPortal(
          <div
            className="fixed px-3 py-1.5 text-xs text-white bg-black/70 backdrop-blur-sm rounded-md z-[9999] shadow-lg border border-gray-600"
            style={{
              top: tooltip.y,
              left: tooltip.x,
              transform: "translate(-50%, -100%)",
              whiteSpace: "nowrap",
            }}
          >
            {tooltip.name}
          </div>,
          document.body
        )}
      {dropdownPosition && editingTaskId && (
        createPortal(
          <div
            className="fixed z-[9999] bg-[#1f2937] border border-gray-700 rounded shadow-md p-1 min-w-max"
            style={{ top: dropdownPosition.y + 4, left: dropdownPosition.x }}
            onClick={e => e.stopPropagation()}
          >
            {(dropdownType === "status"
              ? ["pending", "in-progress", "completed"]
              : ["high", "mid", "low"]
            ).map((option) => (
              <div
                key={option}
                onClick={() => {
                  handleInlineEdit(editingTaskId, dropdownType, option);
                  setEditingTaskId(null);
                  setEditingField(null);
                  setDropdownPosition(null);
                }}

                className="px-2 py-1 hover:bg-gray-600 cursor-pointer rounded"
                autoFocus
              >
                <BadgeLabel type={dropdownType} value={option} />
              </div>
            ))}
          </div>,
          document.body
        )
      )}
    </div>
  );
}
export default TaskListView;

