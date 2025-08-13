'use client'

import React, { useEffect } from 'react'
import { Loader2, MessageSquare } from 'lucide-react'
import { useCommentStore } from '@/stores/commentStore'
import { CommentItem } from './CommentItem'
import { CommentInput } from './CommentInput'

interface CommentsListProps {
  issueId: string
  currentUserId?: string
}

export function CommentsList({ issueId, currentUserId }: CommentsListProps) {
  const { 
    fetchComments, 
    getCommentsByIssue, 
    loadingStates 
  } = useCommentStore()

  const comments = getCommentsByIssue(issueId)
  const isLoading = loadingStates[`fetchComments-${issueId}`]

  useEffect(() => {
    fetchComments(issueId)
  }, [issueId, fetchComments])

  const handleCommentAdded = () => {
    // Refresh comments after adding a new one
    fetchComments(issueId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading comments...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Comment Input */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Comments</h3>
        </div>
        
        <CommentInput
          issueId={issueId}
          onCommentAdded={handleCommentAdded}
        />
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </div>
  )
} 