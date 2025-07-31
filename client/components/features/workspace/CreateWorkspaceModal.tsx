import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/organisms/dialog'
import { WorkspaceForm } from '@/components/ui/organisms/WorkspaceForm'
import React from 'react'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { useRouter } from 'next/navigation'
import { Workspace } from '@/types/workspace'

interface CreateWorkspaceModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CreateWorkspaceModal = ({ isOpen, onClose }: CreateWorkspaceModalProps) => {
  const {addWorkspace} = useWorkspaceStore();
  const router = useRouter()

    const handleWorkspaceCreate = async (workspace: Workspace) => {
        await addWorkspace(workspace)
        router.push(`/${workspace.slug}/myissues`)
        onClose()
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pb-4">
          <DialogTitle>Create New Workspace</DialogTitle>
        </DialogHeader>
        <WorkspaceForm
          onSuccess={handleWorkspaceCreate}
          onCancel={onClose}
          submitText="Create Workspace"
          cancelText="Cancel"
        />
      </DialogContent>
    </Dialog>
    </div>
  )
}