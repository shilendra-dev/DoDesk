'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/atoms/button'
import { CreateTaskModal } from '@/components/features/tasks/CreateTaskModal'
import { useWorkspace } from '@/providers/WorkspaceContext'

interface CreateTaskButtonProps {
  workspaceId?: string
  showCreateTask: boolean
  setShowCreateTask: (show: boolean) => void
}

export function CreateTaskButton({ 
  workspaceId, 
  showCreateTask, 
  setShowCreateTask 
}: CreateTaskButtonProps) {
  const { currentWorkspace } = useWorkspace()

  return (
    <>
      <Button
        onClick={() => setShowCreateTask(true)}
        className="flex items-center gap-2"
      >
        <Plus size={16} />
        Create Issue
      </Button>

      {showCreateTask && (
        <CreateTaskModal
          workspaceId={workspaceId || currentWorkspace?.id}
          isOpen={showCreateTask}
          onClose={() => setShowCreateTask(false)}
        />
      )}
    </>
  )
}