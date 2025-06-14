import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import BadgeLabel from '../atoms/BadgeLabel';
import { MoreVertical, Eye } from 'lucide-react';
import TaskDetails from "./TaskDetails";

function TaskColumn({ column, tasks, onTaskSelect}) {
  const [localTasks, setLocalTasks] = useState(tasks);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({});
  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const Tooltip = ({ children, position }) =>
    createPortal(
      <div
        className="fixed px-2 py-1 text-xs text-white bg-gray-800 z-50 rounded shadow-lg whitespace-nowrap pointer-events-none"
        style={position}
      >
        {children}
      </div>,
      document.body
    );

  return (
    <div className="relative w-full max-w-[400px] bg-[#1c243a] rounded-lg overflow-visible shadow p-3 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold capitalize text-gray-100">{column.title}</h2>
          <BadgeLabel type="status" value={column.id} />
          <span className="text-sm text-gray-400">({localTasks.length})</span>
        </div>

        <div className="flex items-center gap-2 relative">
          {/* Column Menu Button */}
          <button
            onClick={() => setShowColumnMenu(!showColumnMenu)}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
          >
            <MoreVertical size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col flex-1 h-full bg-[#1c243a] overflow-visible rounded-lg shadow transition-colors duration-300 min-w-0 ${
              snapshot.isDraggingOver ? 'bg-blue-900/20' : ''
            }`}
          >
            <div className="flex-1 overflow-y-auto">
              {localTasks.map((task, idx) => (
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
                        <div className="text-xs text-gray-300">Priority:</div>
                        <BadgeLabel type="priority" value={task.priority} />
                        <span className="text-xs text-gray-300">
                          <p>Due date: {task.due_date && new Date(task.due_date).toLocaleDateString()}</p>
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(task);
                          }}
                          className="ml-auto p-1 rounded hover:bg-gray-700 transition"
                          title="View Task Details"
                        >
                          <Eye size={16} className="text-gray-400" />
                        </button>
                      </div>

                      <div className="text-xs text-gray-400 mt-2 mb-2 truncate">
                        Created by: {task.created_by_name}
                      </div>

                      {/* Assignees */}
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
                                {/* Assignee Avatar */}
                                <div
                                  className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center ring-2 ring-gray-900 shadow-lg hover:scale-105 transition-transform duration-150"
                                  title={assignee.name}
                                  onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setTooltipPosition({
                                      top: rect.top - 32,
                                      left: rect.left + rect.width / 2,
                                      transform: 'translateX(-50%)',
                                    });
                                    setShowTooltip(index);
                                    setHoveredTaskId(task.id);
                                  }}
                                  onMouseLeave={() => {
                                    setShowTooltip(null);
                                    setHoveredTaskId(null);
                                  }}
                                >
                                  {assignee.name?.substring(0, 2).toUpperCase()}
                                </div>
                                {showTooltip === index && hoveredTaskId === task.id && (
                                  <Tooltip position={tooltipPosition}>{assignee.name}</Tooltip>
                                )}
                              </div>
                            ))}
                            {task.assignees.length > 3 && (
                              <div
                                className="relative group"
                                style={{ zIndex: 0 }}
                                onMouseEnter={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setTooltipPosition({
                                    top: rect.top - 32,
                                    left: rect.left + rect.width / 2,
                                    transform: 'translateX(-50%)',
                                  });
                                  setShowTooltip('more');
                                  setHoveredTaskId(task.id);
                                }}
                                onMouseLeave={() => {
                                  setShowTooltip(null);
                                  setHoveredTaskId(null);
                                }}
                              >
                                {/* Additional Assignees Avatar */}
                                <div
                                  className="w-8 h-8 rounded-full bg-gray-600 text-white text-xs font-bold flex items-center justify-center ring-2 ring-gray-900 shadow-lg"
                                  title={`${task.assignees.length - 3} more`}
                                >
                                  +{task.assignees.length - 3}
                                </div>
                                {showTooltip === 'more' && hoveredTaskId === task.id && (
                                  <Tooltip position={tooltipPosition}>
                                    {task.assignees.slice(3).map((a) => a.name).join(', ')}
                                  </Tooltip>
                                )}
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
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          tasks={localTasks}
          setTasks={setLocalTasks}
        />
      )}
    </div>
  );
}

export default TaskColumn;