import axios from "axios";

export const getAllWorkspaceMembers = async (workspaceId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`/api/workspaces/${workspaceId}/members`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Add auth header
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching workspace members:", error);
    throw error; // Re-throw if you want to handle it further up the call stack
  }
};
