import api from '@/lib/axios'
import { Issue, CreateIssueData, UpdateIssueData } from '@/types/issue'

export const issueService = {
  // Get all issues for a workspace or team
  getIssuesByWorkspace: async (workspaceId: string): Promise<Issue[]> => {
    const response = await api.get(`/api/workspace/${workspaceId}/issues`)
    return response.data.issues || []
  },

  // Get all issues for a team
  getIssuesByTeam: async (teamId: string): Promise<Issue[]> => {
    const response = await api.get(`/api/team/${teamId}/issues`)
    return response.data.issues || []
  },

  // Create a new issue
  createIssue: async (issueData: CreateIssueData): Promise<Issue> => {
    const response = await api.post(`/api/team/${issueData.teamId}/issues`, issueData)
    return response.data.issue
  },

  // Update an issue
  updateIssue: async (issueId: string, issueData: UpdateIssueData): Promise<Issue> => {
    // Filter out null/undefined values
    const filteredData = Object.fromEntries(
      Object.entries(issueData).filter(([, value]) => value != null && value !== '')
    )
    const response = await api.put(`/api/issues/${issueId}`, filteredData)
    return response.data.issue
  },

  // Delete an issue
  deleteIssue: async (issueId: string): Promise<void> => {
    await api.delete(`/api/issues/${issueId}`)
  },

  // Assign a user to an issue
  assignIssue: async (issueId: string, assigneeId: string): Promise<Issue> => {
    // This assumes backend supports updating assigneeId via update endpoint
    const response = await api.put(`/api/issues/${issueId}`, { assigneeId })
    return response.data.issue
  },

  // Update issue notes
  updateNotes: async (issueId: string, notes: string): Promise<Issue> => {
    const response = await api.put(`/api/issues/${issueId}`, { notes })
    return response.data.issue
  },

  // Get comments for an issue
  getComments: async (issueId: string): Promise<Comment[]> => {
    const response = await api.get(`/api/issues/${issueId}/comments`)
    return response.data.comments || []
  },

  // Create a new comment for an issue
  createComment: async (issueId: string, content: string): Promise<Comment> => {
    const response = await api.post(`/api/issues/${issueId}/comments`, { content })
    return response.data.comment
  },

  // Update an existing comment
  updateComment: async (commentId: string, content: string): Promise<Comment> => {
    const response = await api.put(`/api/comments/${commentId}`, { content })
    return response.data.comment
  },

  // Delete a comment
  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(`/api/comments/${commentId}`)
  }
}