import axios from "axios";

export const assignTaskToMembers = async (taskId, assigneeIds) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `http://localhost:5033/api/task/${taskId}/assign`,
    { assignees: assigneeIds },
    
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const removeAssignee = async (taskId, userId) => {
  const token = localStorage.getItem("token");
  const res = await axios.delete(
    `http://localhost:5033/api/task/${taskId}/removeAssignee`,
    {
      data: { userId },
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return res.data;
};

export const updateTask = async (taskId, updatedData) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(
    `http://localhost:5033/api/task/${taskId}`,
    updatedData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};