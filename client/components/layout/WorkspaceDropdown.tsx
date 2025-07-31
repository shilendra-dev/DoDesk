"use client";

import React from "react";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { Button } from "@/components/ui/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/atoms/dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { useRouter } from "next/navigation";

export function WorkspaceDropdown() {
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const { openCreateWorkspace } = useModalStore();
  const router = useRouter();
  const { switchWorkspace } = useWorkspaceStore();

  const handleWorkspaceSwitch = async (slug: string) => {
    await switchWorkspace(slug);

    router.push(`/${slug}/myissues`);
  };

  if (!currentWorkspace) {
    return (
      <div className="px-2 py-1 text-sm text-muted-foreground">
        Loading workspace...
      </div>
    );
  }

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex-auto pl-2 h-7 text-sm tracking-wide justify-start max-w-full w-full focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <span className="truncate">{currentWorkspace.name}</span>
          <ChevronDown
            size={16}
            className="ml-auto -mr-3 text-muted-foreground"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-card" align="start">
        {/* Workspaces */}
        <DropdownMenuGroup>
          {/* Current workspace first */}
          <DropdownMenuItem
            key={currentWorkspace.id}
            onClick={() => handleWorkspaceSwitch(currentWorkspace.slug)}
            className="flex items-center gap-2 bg-muted cursor-pointer"
          >
            <span className="truncate">{currentWorkspace.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">Current</span>
          </DropdownMenuItem>
          
          {/* Other workspaces */}
          {workspaces
            .filter((workspace) => workspace.id !== currentWorkspace.id)
            .map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => handleWorkspaceSwitch(workspace.slug)}
                className="flex items-center gap-2 mt-1 cursor-pointer"
              >
                <span className="truncate">{workspace.name}</span>
              </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Add Workspace */}
        <DropdownMenuItem onClick={openCreateWorkspace} className="cursor-pointer">
          <Plus size={16} />
          <span>Add Workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
