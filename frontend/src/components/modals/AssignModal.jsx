import React, { useState } from "react";

function AssignModal({ isOpen, onClose, taskId, members, onAssign }) {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAssign = () => {
    onAssign(taskId, selectedIds);
    setSelectedIds([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#121826] p-6 rounded-xl w-80 shadow-lg">
        <h2 className="text-lg text-white mb-4">Assign Members</h2>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {members.map((member) => (
            <label key={member.id} className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={selectedIds.includes(member.id)}
                onChange={() => toggleSelect(member.id)}
              />
              {member.name}
            </label>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="text-sm text-gray-400 hover:underline">
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignModal;
