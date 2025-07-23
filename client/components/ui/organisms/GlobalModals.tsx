'use client'
import { useModalStore } from '@/stores/modalStore'
import { CreateIssueModal } from '@/components/features/issues/CreateIssueModal'
import { useWorkspaceStore } from '@/stores/workspaceStore'

export function GlobalModals() {
  const createIssueOpen = useModalStore((s) => s.createIssueOpen)
  const closeCreateIssue = useModalStore((s) => s.closeCreateIssue)
  const currentWorkspace = useWorkspaceStore((s) => s.currentWorkspace)

  return (
    <CreateIssueModal
      workspaceId={currentWorkspace?.id}
      isOpen={createIssueOpen}
      onClose={closeCreateIssue}
    />
  )
}