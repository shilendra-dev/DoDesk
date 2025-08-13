import api from '@/lib/axios'

export interface Comment {
  id: string
  content: string
  issueId: string
  userId?: string
  parentCommentId?: string
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string | null
    email: string
  }
  replies?: Comment[]
}

export interface CreateCommentData {
  content: string
  parentCommentId?: string
}

export interface UpdateCommentData {
  content: string
}

class CommentService {
  async getComments(issueId: string): Promise<Comment[]> {
    const response = await api.get(`/api/issues/${issueId}/comments`)
    return response.data.data.comments
  }

  async createComment(issueId: string, data: CreateCommentData): Promise<Comment> {
    const response = await api.post(`/api/issues/${issueId}/comments`, data)
    return response.data.data.comment
  }

  async updateComment(commentId: string, data: UpdateCommentData): Promise<Comment> {
    const response = await api.put(`/api/comments/${commentId}`, data)
    return response.data.data.comment
  }

  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/api/comments/${commentId}`)
  }
}

export const commentService = new CommentService() 