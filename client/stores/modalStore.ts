
import { create } from 'zustand'

interface ModalState {
  createIssueOpen: boolean
  openCreateIssue: () => void
  closeCreateIssue: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  createIssueOpen: false,
  openCreateIssue: () => set({ createIssueOpen: true }),
  closeCreateIssue: () => set({ createIssueOpen: false }),
}))