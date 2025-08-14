import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import { Comment, CreateCommentData, UpdateCommentData } from '@/services/commentService'
import { commentService } from '@/services/commentService'
import { toast } from 'react-hot-toast'

interface CommentState {
  comments: Record<string, Comment[]>
  loadingStates: Record<string, boolean>
  errors: Record<string, string>
}

interface CommentActions {
  fetchComments: (issueId: string) => Promise<void>
  createComment: (issueId: string, data: CreateCommentData) => Promise<Comment | null>
  updateComment: (commentId: string, data: UpdateCommentData) => Promise<void>
  deleteComment: (commentId: string) => Promise<void>
  clearError: (operationId?: string) => void
  getCommentsByIssue: (issueId: string) => Comment[]
}

type CommentStore = CommentState & CommentActions

export const useCommentStore = create<CommentStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      comments: {},
      loadingStates: {},
      errors: {},

      // Fetch comments for an issue
      fetchComments: async (issueId: string) => {
        const operationId = `fetchComments-${issueId}`
        set(state => ({
          loadingStates: { ...state.loadingStates, [operationId]: true },
          errors: { ...state.errors, [operationId]: '' }
        }))

        try {
          const comments = await commentService.getComments(issueId)
          set(state => ({
            comments: { ...state.comments, [issueId]: comments },
            loadingStates: { ...state.loadingStates, [operationId]: false }
          }))
        } catch (error) {
          set(state => ({
            errors: { ...state.errors, [operationId]: 'Failed to fetch comments' },
            loadingStates: { ...state.loadingStates, [operationId]: false }
          }))
          console.error('Failed to fetch comments:', error)
          toast.error('Failed to fetch comments')
        }
      },

      // Create a new comment
      createComment: async (issueId: string, data: CreateCommentData) => {
        const operationId = `createComment-${issueId}`
        set(state => ({
          loadingStates: { ...state.loadingStates, [operationId]: true },
          errors: { ...state.errors, [operationId]: '' }
        }))

        try {
          const newComment = await commentService.createComment(issueId, data)
          
          set(state => ({
            comments: {
              ...state.comments,
              [issueId]: [...(state.comments[issueId] || []), newComment]
            },
            loadingStates: { ...state.loadingStates, [operationId]: false }
          }))

          toast.success('Comment added successfully')
          return newComment
        } catch (error) {
          set(state => ({
            errors: { ...state.errors, [operationId]: 'Failed to create comment' },
            loadingStates: { ...state.loadingStates, [operationId]: false }
          }))
          console.error('Failed to create comment:', error)
          toast.error('Failed to create comment')
          return null
        }
      },

      // Update a comment
      updateComment: async (commentId: string, data: UpdateCommentData) => {
        const operationId = `updateComment-${commentId}`
        set(state => ({
          loadingStates: { ...state.loadingStates, [operationId]: true },
          errors: { ...state.errors, [operationId]: '' }
        }))

        try {
          const updatedComment = await commentService.updateComment(commentId, data)
          
          set(state => ({
            comments: Object.fromEntries(
              Object.entries(state.comments).map(([issueId, comments]) => [
                issueId,
                comments.map(comment => 
                  comment.id === commentId ? updatedComment : comment
                )
              ])
            ),
            loadingStates: { ...state.loadingStates, [operationId]: false }
          }))

          toast.success('Comment updated successfully')
        } catch (error) {
          set(state => ({
            errors: { ...state.errors, [operationId]: 'Failed to update comment' },
            loadingStates: { ...state.loadingStates, [operationId]: false }
          }))
          console.error('Failed to update comment:', error)
          toast.error('Failed to update comment')
        }
      },

      // Delete a comment
      deleteComment: async (commentId: string) => {
        const operationId = `deleteComment-${commentId}`
        set(state => ({
          loadingStates: { ...state.loadingStates, [operationId]: true },
          errors: { ...state.errors, [operationId]: '' }
        }))

        try {
          await commentService.deleteComment(commentId)
          
          set(state => ({
            comments: Object.fromEntries(
              Object.entries(state.comments).map(([issueId, comments]) => [
                issueId,
                comments.filter(comment => comment.id !== commentId)
              ])
            ),
            loadingStates: { ...state.loadingStates, [operationId]: false }
          }))

          toast.success('Comment deleted successfully')
        } catch (error) {
          set(state => ({
            errors: { ...state.errors, [operationId]: 'Failed to delete comment' },
            loadingStates: { ...state.loadingStates, [operationId]: false }
          }))
          console.error('Failed to delete comment:', error)
          toast.error('Failed to delete comment')
        }
      },

      // Clear error
      clearError: (operationId?: string) => {
        if (operationId) {
          set(state => ({
            errors: { ...state.errors, [operationId]: '' }
          }))
        } else {
          set({ errors: {} })
        }
      },

      // Get comments by issue ID
      getCommentsByIssue: (issueId: string) => {
        return get().comments[issueId] || []
      }
    }))
  )
) 