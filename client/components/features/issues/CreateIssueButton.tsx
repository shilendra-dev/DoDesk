'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/atoms/button'
import { CreateIssueModal } from '@/components/features/issues/CreateIssueModal'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { cn } from '@/lib/utils'

interface CreateIssueButtonProps {
  workspaceId?: string
  showCreateIssue: boolean
  setShowCreateIssue: (show: boolean) => void
  size?: 'sm' | 'lg' | 'default' | 'xs' | 'icon' | null | undefined
}

export function CreateIssueButton({ 
  workspaceId, 
  showCreateIssue, 
  setShowCreateIssue,
  size = 'sm'
}: CreateIssueButtonProps) {
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace)

  return (
    <>
      <Button
        onClick={() => setShowCreateIssue(true)}
        className={cn("flex items-center gap-2", size === 'xs' && "text-xs")}
        size={size}
        variant='default'
      >
        <Plus size={16} />
        Create Issue
      </Button>

      {showCreateIssue && (
        <CreateIssueModal
          workspaceId={workspaceId || currentWorkspace?.id}
          isOpen={showCreateIssue}
          onClose={() => setShowCreateIssue(false)}
        />
      )}
    </>
  )
}