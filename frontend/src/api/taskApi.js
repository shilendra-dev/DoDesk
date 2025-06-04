import axios from "axios";

export const assignTaskToMembers = async (taskId, assigneeIds) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `http://localhost:5033/api/tasks/${taskId}/assign`,
    { assignees: assigneeIds },
    
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};


export const updateTask = async (taskId, updatedData) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(
    `http://localhost:5033/api/tasks/${taskId}`,
    updatedData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};