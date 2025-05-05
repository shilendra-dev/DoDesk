import React, { useEffect, useState } from "react";
import { assignTaskToMembers } from "../../api/taskApi";

function AssignModal({ isOpen, onClose, taskId, members = [], onAssign }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedIds([]);
    }
  }, [isOpen]);

  const toggleSelect = (userId) => {
    setSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter((i) => i !== userId) : [...prev, userId]
    );
  };

  const handleAssign = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    try {
      await assignTaskToMembers(taskId, selectedIds);
      if (onAssign) onAssign(taskId, selectedIds); // Trigger the callback to reload the component
    } catch (error) {
      console.error("Failed to assign members:", error);
    } finally {
      setLoading(false);
      setSelectedIds([]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#121826] p-6 rounded-2xl w-80 shadow-2xl border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">Assign Members</h2>

        {members.length === 0 ? (
          <p className="text-gray-400 text-sm">No members available</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {members.map((member) => {
              const userId = member.user_id;
              const isChecked = selectedIds.includes(userId);
              return (
                <label
                  key={userId}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
                    isChecked ? "bg-green-700/20" : "hover:bg-gray-800"
                  }`}
                  onClick={() => toggleSelect(userId)}
                >
                  <span
                    className={`w-5 h-5  rounded border-2 flex items-center justify-center transition ${
                      isChecked
                        ? "border-green-500 bg-green-600"
                        : "border-gray-500 bg-transparent"
                    }`}
                  >
                    {isChecked && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="text-sm text-white">{member.name}</span>
                </label>
              );
            })}
          </div>
        )}

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="text-sm text-gray-400 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={selectedIds.length === 0 || loading}
            className={`px-4 py-1.5 rounded-md text-sm font-medium text-white transition ${
              selectedIds.length === 0 || loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignModal;
