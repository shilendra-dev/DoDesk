'use client'
import { useModalStore } from '@/stores/modalStore'
import { CreateIssueModal } from '@/components/features/issues/CreateIssueModal'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { CreateWorkspaceModal } from '@/components/features/workspace/CreateWorkspaceModal'
import { InviteMemberModal } from '@/components/features/inviteMember/inviteMemberModal'

export function GlobalModals() {
  const createIssueOpen = useModalStore((s) => s.createIssueOpen)
  const closeCreateIssue = useModalStore((s) => s.closeCreateIssue)
  const currentWorkspace = useWorkspaceStore((s) => s.currentWorkspace)
  const createWorkspaceOpen = useModalStore((s) => s.createWorkspaceOpen)
  const closeCreateWorkspace = useModalStore((s) => s.closeCreateWorkspace)
  const inviteMemberOpen = useModalStore((s) => s.inviteMemberOpen)
  const closeInviteMember = useModalStore((s) => s.closeInviteMember)

  return (
    <>
    <CreateIssueModal
      key="create-issue-modal"
      workspaceId={currentWorkspace?.id}
      isOpen={createIssueOpen}
      onClose={closeCreateIssue}
    />

    <CreateWorkspaceModal
      key="create-workspace-modal"
      isOpen={createWorkspaceOpen}
      onClose={closeCreateWorkspace}
    />

    <InviteMemberModal
      key="invite-member-modal"
      isOpen={inviteMemberOpen}
      onClose={closeInviteMember}
    />
    </>
  )
}