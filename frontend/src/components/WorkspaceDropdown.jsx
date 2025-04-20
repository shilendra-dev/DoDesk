import { useEffect, useState } from "react";

function WorkspaceDropdown({ onSelect }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchWorkspaces = () => {
      try {
        const storedWorkspaces = localStorage.getItem("workspaces");
        if (storedWorkspaces) {
          const parsedWorkspaces = JSON.parse(storedWorkspaces);
          setWorkspaces(parsedWorkspaces);
          if (parsedWorkspaces.length > 0) {
            setSelected(parsedWorkspaces[0]);
            onSelect?.(parsedWorkspaces[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch workspaces", err);
      }
    };

    fetchWorkspaces();

    const handleUpdate = () =>{
      fetchWorkspaces();
    };
    window.addEventListener("workspace-updated", handleUpdate);

    return () =>{
      window.removeEventListener("workspace-updated", handleUpdate);
    }
  }, [onSelect]);

  const handleSelect = (workspace) => {
    setSelected(workspace);
    onSelect?.(workspace);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-xs mb-6">
      <button
        id="dropdownDefaultButton"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-left inline-flex items-center justify-between dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        {selected ? selected.name : "Select Workspace"}
        <svg
          className="w-4 h-4 ml-2"
          aria-hidden="true"
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
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
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
