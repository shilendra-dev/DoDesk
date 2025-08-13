'use client'

import React, { useState } from 'react'
import { Edit3, Trash2, MoreVertical, Reply } from 'lucide-react'
import { Button } from '@/components/ui/atoms/button'
import { Input } from '@/components/ui/atoms/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/atoms/dropdown-menu'
import { useCommentStore } from '@/stores/commentStore'
import { Comment } from '@/services/commentService'
import { formatDistanceToNow } from 'date-fns'

interface CommentItemProps {
  comment: Comment
  currentUserId?: string
}

export function CommentItem({ comment, currentUserId }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const { updateComment, deleteComment, loadingStates } = useCommentStore()

  const canEdit = currentUserId === comment.userId
  const canDelete = currentUserId === comment.userId
  const isLoading = loadingStates[`updateComment-${comment.id}`] || loadingStates[`deleteComment-${comment.id}`]

  const handleEdit = () => {
    setIsEditing(true)
    setEditContent(comment.content)
  }

  const handleSave = async () => {
    if (editContent.trim() && editContent !== comment.content) {
      await updateComment(comment.id, { content: editContent.trim() })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditContent(comment.content)
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(comment.id)
    }
  }

  const handleReply = () => {
    // TODO: Implement reply functionality
    console.log('Reply to comment:', comment.id)
  }

  return (
    <div className="group relative">
      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
            {comment.user?.name?.[0]?.toUpperCase() || comment.user?.email?.[0]?.toUpperCase() || '?'}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-foreground">
              {comment.user?.name || comment.user?.email || 'Unknown User'}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
            {comment.updatedAt !== comment.createdAt && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSave()
                  } else if (e.key === 'Escape') {
                    handleCancel()
                  }
                }}
                className="text-sm"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={isLoading || !editContent.trim()}
                  size="sm"
                  variant="default"
                >
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={isLoading}
                  size="sm"
                  variant="ghost"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-foreground whitespace-pre-wrap">
              {comment.content}
            </div>
          )}

          {/* Reply button */}
          <div className="mt-2">
            <Button
              onClick={handleReply}
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
          </div>
        </div>

        {/* Actions */}
        {(canEdit || canDelete) && (
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canEdit && (
                  <DropdownMenuItem onClick={handleEdit} disabled={isLoading}>
                    <Edit3 className="h-3 w-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <DropdownMenuItem onClick={handleDelete} disabled={isLoading} className="text-destructive">
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  )
} 