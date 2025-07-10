import React from "react";
import { createPortal } from "react-dom";
import { Funnel, Save, Trash2, X } from "lucide-react";
import HeadlessButton from "../../../shared/components/atoms/headlessUI/HeadlessButton";
import HeadlessInput from "../../../shared/components/atoms/headlessUI/HeadlessInput";
import Select from "../../../shared/components/atoms/Select";
import Label from "../../../shared/components/atoms/Label";
import FilterSelect from "../../../shared/components/molecules/FilterSelect";

const TaskFilterBar = ({
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
  handleClearAll,
}) => {
  return (
    <>
      {/* Filter View Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg)] dark:bg-[var(--color-bg)] backdrop-blur border-b border-[var(--color-border)] dark:border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <Funnel className="text-gray-500" size={16} />
          {hasActiveFilters ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{filterSummary}</span>
              {selectedViewId === "none" ? (
                <HeadlessButton
                  onClick={() => setShowSaveFilterModal(true)}
                  size="sm"
                  className="flex items-center gap-1 px-2 py-1 text-xs"
                  title="Save this view"
                >
                  <Save className="text-gray-500" size={16} />
                  Save View
                </HeadlessButton>
              ) : (
                <HeadlessButton
                  onClick={handleDeleteView}
                  className="flex items-center gap-1 px-2 py-1 text-xs"
                  size="sm"
                  title="Delete selected view"
                >
                  <Trash2 className="text-red-400" size={16} />
                  Delete View
                </HeadlessButton>
              )}
            </div>
          ) : (
            <span className="text-xs text-gray-500 italic">No filters applied</span>
          )}
        </div>
        {Array.isArray(savedFilters) && savedFilters.length > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-[var(--color-text)] dark:text-[var(--color-text)]">View:</span>
            <Select onChange={handleViewSelect} value={selectedViewId}>
            <option value="none">None</option>
            {savedFilters.map((filter) => (
              <option key={filter.id} value={String(filter.id)}>
                {filter.name}
              </option>
            ))}
          </Select>
          </div>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex justify-between items-center flex-wrap gap-4 px-4 py-3 bg-[var(--color-bg)] dark:bg-[var(--color-bg)] backdrop-blur">
        <div className="flex gap-4 items-center">
          {filterConfigs.map((cfg) => (
            <div key={cfg.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <FilterSelect {...cfg} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {/* Sort Option */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Label htmlFor="sortOption" className="text-sm w-20 font-medium text-[var(--color-text)] dark:text-[var(--color-text)]">
              Sort by
            </Label>
            <Select
              id="sortOption"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
          {/* Clear Button */}
          {(statusFilter !== "All" ||
            priorityFilter !== "All" ||
            assigneeFilter !== "All" ||
            sortOption !== "None" ||
            selectedViewId !== "none") && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors"
              title="Clear all filters and view"
            >
              <X className="text-red-400" size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Save View Modal */}
      {showSaveFilterModal &&
        createPortal(
          <div className="fixed inset-0 bg-[var(--color-bg-overlay)] dark:bg-[var(--color-bg-overlay)] backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="bg-[var(--color-bg)] dark:bg-[var(--color-bg)] rounded-lg p-6 w-96 shadow-xl">
              <h3 className="text-lg font-medium text-[var(--color-text)] dark:text-[var(--color-text)] mb-4">
                Save Current View
              </h3>
              <HeadlessInput
                type="text"
                value={newFilterName}
                onChange={(e) => setNewFilterName(e.target.value)}
                className=""
                placeholder="Enter view name"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-4">
                <HeadlessButton
                  onClick={() => {
                    setShowSaveFilterModal(false);
                    setNewFilterName("");
                  }}
                  className="px-4 py-2 text-sm"
                >
                  Cancel
                </HeadlessButton>
                <HeadlessButton
                  onClick={handleSaveFilter}
                  disabled={!newFilterName.trim()}
                  className="px-4 py-2 text-sm"
                  variant="secondary"
                >
                  Save
                </HeadlessButton>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default TaskFilterBar;