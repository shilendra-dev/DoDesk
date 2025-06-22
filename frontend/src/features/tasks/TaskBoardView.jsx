import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import TaskColumn from './components/TaskColumn';
import TaskDetails from './TaskDetails';

import { updateTask } from '../../features/tasks/taskApi';
import { toast } from 'react-hot-toast';
import {Trash2} from 'lucide-react';

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

function TaskBoardView({ tasks, setTasks }) {
  

  // Filters and Sorting States
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  const [sortOption, setSortOption] = useState('None');
  const [selectedTask, setSelectedTask] = useState(null);

  // Filtering Logic
  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      statusFilter === 'All' || task.status.toLowerCase() === statusFilter.toLowerCase();
    const priorityMatch =
      priorityFilter === 'All' || task.priority.toLowerCase() === priorityFilter.toLowerCase();
    const assigneeMatch =
      assigneeFilter === 'All' ||
      (task.assignees &&
        task.assignees.some((assignee) =>
          assignee.name.toLowerCase().includes(assigneeFilter.toLowerCase())
        ));
    return statusMatch && priorityMatch && assigneeMatch;
  });

  // Sorting Logic
  const priorityOrder = { high: 3, mid: 2, low: 1 };
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortOption) {
      case 'Due Date (Asc)':
        return new Date(a.due_date) - new Date(b.due_date);
      case 'Due Date (Desc)':
        return new Date(b.due_date) - new Date(a.due_date);
      case 'Priority (High → Low)':
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'Priority (Low → High)':
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'Title (A → Z)':
        return a.title.localeCompare(b.title);
      case 'Title (Z → A)':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  // Group tasks by status
  const groupedTasks = sortedTasks.reduce((acc, task) => {
    const status = task.status.toLowerCase();
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(task);
    return acc;
  }, {});

  // Handle drag end
  const handleDragEnd = async (result) => {
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
  };

  return (
    <div className="h-full flex flex-col relative overflow-visible">
      {/* Filter and Sort UI */}
      <div className="flex justify-between items-center p-4 bg-[#101221] border-b border-gray-800">
        <div className="flex gap-4 items-center">
          {/* Status Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label htmlFor="statusFilter" className="text-sm font-medium text-gray-300">
              Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-xs text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option>All</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label htmlFor="priorityFilter" className="text-sm font-medium text-gray-300">
              Priority
            </label>
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
            <label htmlFor="assigneeFilter" className="text-sm font-medium text-gray-300">
              Assignee
            </label>
            <select
              id="assigneeFilter"
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-xs text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option>All</option>
              {tasks
                .flatMap((task) => task.assignees || [])
                .filter(
                  (assignee, index, self) =>
                    assignee.name && index === self.findIndex((a) => a.name === assignee.name)
                )
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((assignee) => (
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
            <label htmlFor="sortOption" className="text-sm font-medium text-gray-300">
              Sort by
            </label>
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
            </select>
          </div>

          {/* Clear Filters Button */}
          {(statusFilter !== 'All' || 
                priorityFilter !== 'All' || 
                assigneeFilter !== 'All' || 
                sortOption !== 'None'
                ) && (
                <button
                  onClick ={() => {
                    setStatusFilter('All');
                    setPriorityFilter('All');
                    setAssigneeFilter('All');
                    setSortOption('None');
                    }
                  }
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors"
                  title="Clear all filters and view"
                >
                  <Trash2 size={12} />
                  Clear
                </button>
              )}
        </div>
      </div>

      {/* Task Columns */}
      <div className="overflow-visible flex-1">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="relative flex flex-1 overflow-visible gap-4 p-4 bg-[#101221] min-w-fit">
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