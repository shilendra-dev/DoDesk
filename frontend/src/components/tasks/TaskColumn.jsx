import React, { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import BadgeLabel from '../atoms/BadgeLabel';
import { toast } from 'react-hot-toast';
import { MoreVertical, Plus, Filter } from 'lucide-react';
import CreateTask from './CreateTask';

function TaskColumn({ column, tasks, onTaskSelect, onAddTask, onTaskStatusChange, workspaceId }) {
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');

  // Filter tasks based on priority
  const filteredTasks = tasks.filter((task) => {
    if (filterPriority === 'all') return true;
    return task.priority.toLowerCase() === filterPriority;
  });

  const handleTaskCreated = (newTask) => {
    onAddTask(newTask);
    setShowCreateTask(false);
  };

  return (
    <div className="w-full max-w-[400px] bg-[#1c243a] rounded-lg shadow p-3 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold capitalize text-gray-100">{column.title}</h2>
          <BadgeLabel type="status" value={column.id} />
          <span className="text-sm text-gray-400">({filteredTasks.length})</span>
        </div>

        <div className="flex items-center gap-2 relative">
          {/* Filter Button with Dropdown */}
          <div className="relative">
            {/* Filter Button */}
            <button
              onClick={() => setIsFiltering((prev) => !prev)}
              className={`p-1 rounded hover:bg-gray-700 transition-colors ${
                isFiltering ? 'bg-gray-700' : ''
              }`}
            >
              <Filter size={16} className="text-gray-400" />
            </button>

            {/* Dropdown */}
            {isFiltering && (
              <div
                className="absolute right-0 mt-2 bg-gray-800 rounded shadow-lg z-50 p-2"
                style={{ minWidth: '150px' }}
              >
                <ul className="space-y-1">
                  <li
                    onClick={() => {
                      setFilterPriority('low');
                      setIsFiltering(false); // Close dropdown after selection
                    }}
                    className={`cursor-pointer px-2 py-1 rounded text-sm text-gray-200 hover:bg-gray-700 ${
                      filterPriority === 'low' ? 'bg-gray-700' : ''
                    }`}
                  >
                    Low
                  </li>
                  <li
                    onClick={() => {
                      setFilterPriority('mid');
                      setIsFiltering(false); // Close dropdown after selection
                    }}
                    className={`cursor-pointer px-2 py-1 rounded text-sm text-gray-200 hover:bg-gray-700 ${
                      filterPriority === 'mid' ? 'bg-gray-700' : ''
                    }`}
                  >
                    Medium
                  </li>
                  <li
                    onClick={() => {
                      setFilterPriority('high');
                      setIsFiltering(false); // Close dropdown after selection
                    }}
                    className={`cursor-pointer px-2 py-1 rounded text-sm text-gray-200 hover:bg-gray-700 ${
                      filterPriority === 'high' ? 'bg-gray-700' : ''
                    }`}
                  >
                    High
                  </li>
                  <li
                    onClick={() => {
                      setFilterPriority('all');
                      setIsFiltering(false); // Close dropdown after selection
                    }}
                    className={`cursor-pointer px-2 py-1 rounded text-sm text-gray-200 hover:bg-gray-700 ${
                      filterPriority === 'all' ? 'bg-gray-700' : ''
                    }`}
                  >
                    All
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Add Task Button */}
          <button
            onClick={() => setShowCreateTask(true)}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
          >
            <Plus size={16} className="text-gray-400" />
          </button>

          {/* Column Menu Button */}
          <button
            onClick={() => setShowColumnMenu(!showColumnMenu)}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
          >
            <MoreVertical size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Show Filter Badge */}
      {filterPriority !== 'all' && (
        <div className="mb-3">
          <span
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
              filterPriority === 'low'
                ? 'bg-green-600 text-white'
                : filterPriority === 'mid'
                ? 'bg-yellow-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            Priority: {filterPriority.charAt(0).toUpperCase() + filterPriority.slice(1)}
          </span>
        </div>
      )}

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col flex-1 h-full bg-[#1c243a] rounded-lg shadow transition-colors duration-300 min-w-0 ${
              snapshot.isDraggingOver ? 'bg-blue-900/20' : ''
            }`}
          >
            <div className="flex-1 overflow-y-auto">
              {filteredTasks.map((task, idx) => (
                <Draggable key={task.id} draggableId={task.id} index={idx}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`bg-[#0e172d] w-full max-h-full rounded-lg p-4 mb-2 shadow cursor-pointer border border-transparent hover:border-blue-500 transition-all ${
                        snapshot.isDragging ? 'ring-2 border-blue-400' : ''
                      }`}
                      onClick={() => onTaskSelect && onTaskSelect(task)}
                      
                    >
                      <div className="font-medium text-white mb-1">{task.title}</div>
                      <div className="text-xs text-gray-400 mb-2 truncate">{task.description}</div>
                      <div className="flex gap-2 items-center">
                        <BadgeLabel type="priority" value={task.priority} />
                        <span className="text-xs text-gray-500">
                          {task.due_date && new Date(task.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>

      {/* Create Task Modal */}
      <CreateTask
        isOpen={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        onTaskCreated={handleTaskCreated}
        workspaceId={workspaceId}
        defaultStatus={column.id}
      />
    </div>
  );
}

export default TaskColumn;