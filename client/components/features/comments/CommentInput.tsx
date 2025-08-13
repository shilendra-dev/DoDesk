'use client'

import React, { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/atoms/button'
import { Textarea } from '@/components/ui/atoms/textarea'
import { useCommentStore } from '@/stores/commentStore'

interface CommentInputProps {
  issueId: string
  parentCommentId?: string
  placeholder?: string
  onCommentAdded?: () => void
}

export function CommentInput({ 
  issueId, 
  parentCommentId, 
  placeholder = "Add a comment...",
  onCommentAdded 
}: CommentInputProps) {
  const [content, setContent] = useState('')
  const { createComment, loadingStates } = useCommentStore()
  
  const isLoading = loadingStates[`createComment-${issueId}`]
  const isDisabled = !content.trim() || isLoading

  const handleSubmit = async () => {
    if (isDisabled) return

    try {
      await createComment(issueId, {
        content: content.trim(),
        parentCommentId
      })
      
      setContent('')
      onCommentAdded?.()
    } catch (error) {
      // Error handling is done in the store
      console.error('Failed to create comment:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 min-h-[80px] resize-none"
          disabled={isLoading}
        />
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isDisabled}
          size="sm"
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {parentCommentId ? 'Reply' : 'Comment'}
        </Button>
      </div>
    </div>
  )
} 