import { useEffect, useState } from "react";
import { useWorkspace } from "../../providers/WorkspaceContext"; // adjust path as needed
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ChevronDown } from 'lucide-react';

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
        className="w-full text-white bg-[var(--color-accent)] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-left inline-flex items-center justify-between outline-none"
      >
        {selectedWorkspace ? selectedWorkspace.name : "Select Workspace"}
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 bg-[var(--color-bg)] border-1 border-[var(--color-border)] rounded-lg shadow w-full">
          <ul className="py-2 text-sm text-[var(--color-text)] ">
            {workspaces.map((workspace) => (
              <li key={workspace.id}>
                <button
                  onClick={() => handleSelect(workspace)}
                  className="w-full text-left block px-4 py-2 hover:bg-[var(--color-ghost)] border-b border-[var(--color-border)]"
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
