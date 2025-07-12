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
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-transparent focus:outline-none font-medium text-sm px-0 py-1 text-left inline-flex items-center justify-between outline-none text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] rounded transition-all duration-200 ease-in-out"
      >
        {selectedWorkspace ? selectedWorkspace.name : "Select Workspace"}
        <ChevronDown className="w-4 h-4 ml-2 text-[var(--color-text-tertiary)]" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] rounded-lg shadow-lg w-full">
          <ul className="py-1 text-sm">
            {workspaces.map((workspace) => (
              <li key={workspace.id}>
                <button
                  onClick={() => handleSelect(workspace)}
                  className="w-full text-left block px-3 py-2 hover:bg-[var(--color-bg-hover)] text-[var(--color-text-primary)] hover:text-[var(--color-text-primary)] transition-colors"
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
