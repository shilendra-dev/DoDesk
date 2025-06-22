import { useEffect, useState } from "react";
import { useWorkspace } from "../../providers/WorkspaceContext"; // adjust path as needed
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function WorkspaceDropdown() {
  const { workspaces, selectedWorkspace, setSelectedWorkspace, setDefaultWorkspace, setDefaultWorkspaceId } =
    useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  useEffect(() => {
    if (workspaceId) {
      const workspace = workspaces.find((ws) => ws.id === workspaceId);
      if (workspace) {
        setSelectedWorkspace(workspace);
      }
    }
  }, [workspaceId, workspaces, setSelectedWorkspace]);

  const handleSelect = async (workspace) => {
    setSelectedWorkspace(workspace);
    setDefaultWorkspace(workspace);
    setDefaultWorkspaceId(workspace.id);
    navigate(`/${workspace.id}`);
    setIsOpen(false);

    // Update default workspace in backend
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5033/api/user/set-default-workspace`,
        { workspace_id: workspace.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Optionally update user/defaultWorkspaceId in context if needed
    } catch (err) {
      console.error("Failed to set default workspace:", err);
    }
  };

  return (
    <div className="relative w-full max-w-xs mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-left inline-flex items-center justify-between dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        {selectedWorkspace ? selectedWorkspace.name : "Select Workspace"}
        <svg
          className="w-4 h-4 ml-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            {workspaces.map((workspace) => (
              <li key={workspace.id}>
                <button
                  onClick={() => handleSelect(workspace)}
                  className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {workspace.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default WorkspaceDropdown;
