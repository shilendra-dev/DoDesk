'use client'

import React from 'react'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/atoms/button'

export function WorkspaceDropdown() {
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace)

  if (!currentWorkspace) {
    return (
      <div className="px-2 py-1 text-sm text-muted-foreground">
        Loading workspace...
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-between px-2 py-1 h-auto text-sm font-medium text-foreground hover:bg-accent/50"
    >
      <span className="truncate">{currentWorkspace.name}</span>
      <ChevronDown size={16} className="ml-2 text-muted-foreground" />
    </Button>
  )
}