import React from "react";
import SearchBar from "../molecules/SearchBar";
import AddMemberButton from "../molecules/AddMemberButton";
import { useWorkspace } from "../../../providers/WorkspaceContext";

function Header() {
  const { selectedWorkspace } = useWorkspace();
  return (
    <div className="flex items-center justify-between p-5 w-full bg-[#101221] h-18 border-b border-b-gray-800">
      <div className="w-2xl flex ">
        <SearchBar />
      </div>
      {selectedWorkspace && (
        <AddMemberButton workspaceId={selectedWorkspace.id} />
      )}
    </div>
  );
}

export default Header;
