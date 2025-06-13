import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import TaskColumn from './TaskColumn';
import { useWorkspace } from '../../context/WorkspaceContext';
import { updateTask } from '../../api/taskApi';
import { toast } from 'react-hot-toast';

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

function TaskBoardView({ tasks, setTasks, onTaskSelect }) {
  const { selectedWorkspace } = useWorkspace();
  const [isDragging, setIsDragging] = useState(false);

  // Group tasks by status
  const groupedTasks = tasks.reduce((acc, task) => {
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
    <div className="h-full flex flex-col overflow-y-auto">
      <div className="overflow-x-auto flex-1">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex flex-1 overflow-y-auto gap-4 p-4 bg-[#101221] min-w-fit">
            {Object.values(COLUMNS).map((column) => (
              <TaskColumn
                key={column.id}
                column={column}
                tasks={groupedTasks[column.id] || []}
                onTaskSelect={onTaskSelect}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default TaskBoardView;