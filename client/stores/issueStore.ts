import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import { Issue, CreateIssueData, UpdateIssueData } from '@/types/issue'
import { issueService } from '@/services/issueService'
import { toast } from 'react-hot-toast'

// Types
interface IssueState {
  issues: Record<string, Issue>
  issueIds: string[]
  selectedIssueId: string | null
  selectedIssueDate: Date | null
  loadingStates: Record<string, boolean>
  errors: Record<string, string>
  lastFetched: number | null
  isInitialized: boolean
}

interface IssueActions {
  fetchIssuesByWorkspace: (workspaceId: string) => Promise<void>
  fetchIssuesByTeam: (teamId: string) => Promise<void>
  createIssue: (issueData: CreateIssueData) => Promise<Issue | null>
  updateIssue: (issueId: string, updates: UpdateIssueData) => Promise<void>
  deleteIssue: (issueId: string) => Promise<void>
  assignIssue: (issueId: string, assigneeId: string) => Promise<void>

  updateNotes: (issueId: string, notes: string) => Promise<void>
  updateIssueDate: (issueId: string, date: Date | undefined) => Promise<void>
  setSelectedIssue: (issueId: string | null) => void
  clearError: (operationId?: string) => void
  getIssueById: (issueId: string) => Issue | undefined
  getIssuesByState: (state: string) => Issue[]
  getIssuesByAssignee: (assigneeId: string) => Issue[]
  getIssuesArray: () => Issue[]
}

type IssueStore = IssueState & IssueActions

// Helpers
function normalizeIssues(issues: Issue[]): Record<string, Issue> {
  return issues.reduce((acc, issue) => {
    acc[issue.id] = issue
    return acc
  }, {} as Record<string, Issue>)
}

function denormalizeIssues(issues: Record<string, Issue>, issueIds: string[]): Issue[] {
  return issueIds.map(id => issues[id]).filter(Boolean)
}

// Store implementation
export const useIssueStore = create<IssueStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      issues: {},
      issueIds: [],
      selectedIssueId: null,
      selectedIssueDate: null,
      loadingStates: {},
      errors: {},
      lastFetched: null,
      isInitialized: false,

      // Fetch issues by workspace
      fetchIssuesByWorkspace: async (workspaceId: string) => {
        const operationId = 'fetchIssuesByWorkspace'
        set(state => ({
          loadingStates: { ...state.loadingStates, [operationId]: true },
          errors: { ...state.errors, [operationId]: '' }
        }))
        try {
          const issues = await issueService.getIssuesByWorkspace(workspaceId)
          const normalizedIssues = normalizeIssues(issues)
          set({
            issues: normalizedIssues,
            issueIds: issues.map(issue => issue.id),
            lastFetched: Date.now(),
            isInitialized: true,
            loadingStates: { ...get().loadingStates, [operationId]: false }
          })
        } catch (error) {
          set(state => ({
            errors: { ...state.errors, [operationId]: 'Failed to fetch issues' },
            loadingStates: { ...state.loadingStates, [operationId]: false }
          }))
          console.error('Failed to fetch issues:', error)
          toast.error('Failed to fetch issues')
        }
      },

      // Fetch issues by team
      fetchIssuesByTeam: async (teamId: string) => {
        const operationId = 'fetchIssuesByTeam'
        set(state => ({
          loadingStates: { ...state.loadingStates, [operationId]: true },
          errors: { ...state.errors, [operationId]: '' }
        }))
        try {
          const issues = await issueService.getIssuesByTeam(teamId)
          const normalizedIssues = normalizeIssues(issues)
          set({
            issues: normalizedIssues,
            issueIds: issues.map(issue => issue.id),
            lastFetched: Date.now(),
            isInitialized: true,
            loadingStates: { ...get().loadingStates, [operationId]: false }
          })
        } catch (error) {
          set(state => ({
            errors: { ...state.errors, [operationId]: 'Failed to fetch issues' },
            loadingStates: { ...state.loadingStates, [operationId]: false }
          }))
          console.error('Failed to fetch issues:', error)
          toast.error('Failed to fetch issues')
        }
      },

      // Create issue
      createIssue: async (issueData: CreateIssueData) => {
        const operationId = 'createIssue'
        set(state => ({
          loadingStates: { ...state.loadingStates, [operationId]: true },
          errors: { ...state.errors, [operationId]: '' }
        }))
        try {
          const newIssue = await issueService.createIssue(issueData)
          set(state => ({
            issues: { ...state.issues, [newIssue.id]: newIssue },
            issueIds: [newIssue.id, ...state.issueIds],
            loadingStates: { ...state.loadingStates, [operationId]: false }
          }))
          toast.success('Issue created successfully!')
          return newIssue
        } catch (error) {
          set(state => ({
            errors: { ...state.errors, [operationId]: 'Failed to create issue' },
            loadingStates: { ...state.loadingStates, [operationId]: false }
          }))
          console.error('Failed to create issue:', error)
          toast.error('Failed to create issue')
          return null
        }
      },

      // Update issue
      updateIssue: async (issueId: string, updates: UpdateIssueData) => {
        const operationId = `updateIssue_${issueId}`
        const validUpdates = Object.fromEntries(
          Object.entries(updates).filter(([, value]) => value != null && value !== '')
        )
        const currentIssue = get().issues[issueId]
        if (!currentIssue) return

        // Optimistic update
        set(state => ({
          issues: {
            ...state.issues,
            [issueId]: { ...currentIssue, ...validUpdates }
          }
        }))

        try {
          const updatedIssue = await issueService.updateIssue(issueId, validUpdates)
          set(state => ({
            issues: { ...state.issues, [issueId]: updatedIssue }
          }))
        } catch (error) {
          // Revert optimistic update
          set(state => ({
            issues: { ...state.issues, [issueId]: currentIssue },
            errors: { ...state.errors, [operationId]: 'Failed to update issue' }
          }))
          console.error('Failed to update issue:', error)
          toast.error('Failed to update issue')
        }
      },

      // Delete issue
      deleteIssue: async (issueId: string) => {
        const operationId = `deleteIssue_${issueId}`
        set(state => ({
          loadingStates: { ...state.loadingStates, [operationId]: true },
          errors: { ...state.errors, [operationId]: '' }
        }))
        try {
          await issueService.deleteIssue(issueId)
          set(state => {
            // Omit the deleted issue from the issues object
            const { [issueId]: _, ...rest } = state.issues
            return {
              issues: rest,
              issueIds: state.issueIds.filter(id => id !== issueId),
              loadingStates: { ...state.loadingStates, [operationId]: false }
            }
          })
          toast.success('Issue deleted successfully!')
        } catch (error) {
          set(state => ({
            errors: { ...state.errors, [operationId]: 'Failed to delete issue' },
            loadingStates: { ...state.loadingStates, [operationId]: false }
          }))
          console.error('Failed to delete issue:', error)
          toast.error('Failed to delete issue')
        }
      },

      // Assign issue
      assignIssue: async (issueId: string, assigneeId: string | null) => {
        try {
          const updatedIssue = await issueService.assignIssue(issueId, assigneeId)
          set(state => ({
            issues: { ...state.issues, [issueId]: updatedIssue }
          }))
        } catch (error) {
          console.error('Failed to assign issue:', error)
          toast.error('Failed to assign issue')
        }
      },

      // Remove assignee
      

      // Update notes
      updateNotes: async (issueId: string, notes: string) => {
        try {
          const updatedIssue = await issueService.updateNotes(issueId, notes)
          set(state => ({
            issues: { ...state.issues, [issueId]: updatedIssue }
          }))
        } catch (error) {
          console.error('Failed to update notes:', error)
          toast.error('Failed to update notes')
        }
      },

      // Update issue date
      updateIssueDate: async (issueId: string, date: Date | undefined) => {
        const operationId = `updateIssueDate_${issueId}`
        const currentIssue = get().issues[issueId]
        if (!currentIssue) return

        // Optimistic update
        const formattedDate = date ? date.toISOString() : undefined
        set(state => ({
          selectedIssueDate: date,
          issues: {
            ...state.issues,
            [issueId]: { ...currentIssue, dueDate: formattedDate }
          }
        }))

        try {
          if (date) {
            await issueService.updateIssue(issueId, { dueDate: formattedDate })
          } else {
            await issueService.updateIssue(issueId, { dueDate: '' })
          }
        } catch (error) {
          // Revert optimistic update
          set(state => ({
            issues: { ...state.issues, [issueId]: currentIssue },
            errors: { ...state.errors, [operationId]: 'Failed to update issue date' }
          }))
          console.error('Failed to update issue date:', error)
          toast.error('Failed to update issue date')
        }
      },

      // UI state management
      setSelectedIssue: (issueId: string | null) => {
        set({ selectedIssueId: issueId })
      },

      clearError: (operationId?: string) => {
        if (operationId) {
          set(state => ({
            errors: Object.fromEntries(
              Object.entries(state.errors).filter(([key]) => key !== operationId)
            )
          }))
        } else {
          set({ errors: {} })
        }
      },

      // Selectors
      getIssueById: (issueId: string) => get().issues[issueId],

      getIssuesByState: (stateName: string) => {
        const { issues } = get()
        return Object.values(issues).filter(issue => issue.state === stateName)
      },

      getIssuesByAssignee: (assigneeId: string) => {
        const { issues } = get()
        return Object.values(issues).filter(issue => issue.assigneeId === assigneeId)
      },

      getIssuesArray: () => {
        const { issues, issueIds } = get()
        return denormalizeIssues(issues, issueIds)
      }
    }))
  )
)