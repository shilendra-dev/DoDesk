import React from "react";
import SearchBar from "../molecules/SearchBar";
import AddMemberButton from "../molecules/AddMemberButton";
import { useWorkspace } from "../../../providers/WorkspaceContext";
import ThemeToggle from "../atoms/ThemeToggle";


function Header() {
  const { selectedWorkspace } = useWorkspace();
  return (
    <div className="flex items-center justify-between p-2.5 w-full bg-[var(--color-bg)] dark:bg-[var(--color-bg)] border-b border-b-gray-800">
      <div className="w-2xl flex ">
        <SearchBar />
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle className="ml-4" />
        {selectedWorkspace && (
          <AddMemberButton workspaceId={selectedWorkspace.id} />
        )}
      </div>

    </div>
  );
}

export default Header;
