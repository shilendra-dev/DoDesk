
import { create } from 'zustand'

interface ModalState {
  createIssueOpen: boolean
  createWorkspaceOpen: boolean
  inviteMemberOpen: boolean
  openCreateIssue: () => void
  closeCreateIssue: () => void
  openCreateWorkspace: () => void
  closeCreateWorkspace: () => void
  openInviteMember: () => void
  closeInviteMember: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  createIssueOpen: false,
  //Issue
  openCreateIssue: () => set({ createIssueOpen: true }),
  closeCreateIssue: () => set({ createIssueOpen: false }),
  
  //Workspace
  createWorkspaceOpen: false,
  openCreateWorkspace: () => set({ createWorkspaceOpen: true }),
  closeCreateWorkspace: () => set({ createWorkspaceOpen: false }),

  //Invite Member
  inviteMemberOpen: false,
  openInviteMember: () => set({ inviteMemberOpen: true }),
  closeInviteMember: () => set({ inviteMemberOpen: false }),
}))