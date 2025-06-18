import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SubtaskList = ({ taskId }) => {
  const [subtasks, setSubtasks] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    fetchSubtasks();
  }, [taskId]);

  const fetchSubtasks = async () => {
    if (!taskId) return; // Ensure taskId is valid
    try {
      const res = await axios.get(`/api/tasks/${taskId}/subtasks`);
      setSubtasks(res.data.subtasks);
    } catch (err) {
      console.error('Error fetching subtasks:', err);
    }
  };

  const handleAddSubtask = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await axios.post(`/api/tasks/${taskId}/subtasks`, { title: newTitle });
      setSubtasks(prev => [...prev, res.data]);
      setNewTitle('');
      setAdding(false);
    } catch (err) {
      console.error('Error adding subtask:', err);
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      
      const res = await axios.patch(`/api/subtasks/${id}`, updates);
      setSubtasks(prev => prev.map(s => (s.id === id ? res.data : s)));
    } catch (err) {
      console.error('Error updating subtask:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/subtasks/${id}`);
      setSubtasks(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error deleting subtask:', err);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-2">To-Do</h3>

      <ul className="space-y-2">
        {subtasks.map(subtask => (
          <li key={subtask.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!subtask.is_completed}
              onChange={(e) =>
                handleUpdate(subtask.id, { is_completed: e.target.checked })
              }
            />
            <input
              type="text"
              value={subtask.title}
              onChange={(e) =>
                handleUpdate(subtask.id, { title: e.target.value })
              }
              className={`bg-transparent border-b border-gray-600 text-white w-full focus:outline-none ${
                subtask.is_completed ? 'line-through text-gray-500' : ''
              }`}
            />
            <button
              onClick={() => handleDelete(subtask.id)}
              className="text-red-400 hover:text-red-600"
              aria-label="Delete subtask"
            >
              🗑
            </button>
          </li>
        ))}

        {adding && (
          <li className="flex items-center gap-2">
            <input type="checkbox" disabled className="opacity-0 pointer-events-none" />
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleAddSubtask}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddSubtask();
                } else if (e.key === 'Escape') {
                  setAdding(false);
                  setNewTitle('');
                }
              }}
              placeholder="Subtask title"
              className="bg-transparent border-b border-gray-600 text-white w-full focus:outline-none"
              autoFocus
            />
          </li>
        )}
      </ul>

      <button
        className="text-blue-400 text-sm hover:underline mt-2"
        onClick={() => {
          setAdding(!adding);
          setNewTitle('');
        }}
        type="button"
      >
        + Add subtask (To-Do)
      </button>
    </div>
  );
};

export default SubtaskList;