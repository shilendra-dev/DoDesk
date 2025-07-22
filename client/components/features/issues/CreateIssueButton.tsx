'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/atoms/button'
import { CreateIssueModal } from '@/components/features/issues/CreateIssueModal'
import { useWorkspaceStore } from '@/stores/workspaceStore'

interface CreateIssueButtonProps {
  workspaceId?: string
  showCreateIssue: boolean
  setShowCreateIssue: (show: boolean) => void
}

export function CreateIssueButton({ 
  workspaceId, 
  showCreateIssue, 
  setShowCreateIssue 
}: CreateIssueButtonProps) {
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace)

  return (
    <>
      <Button
        onClick={() => setShowCreateIssue(true)}
        className="flex items-center gap-2"
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