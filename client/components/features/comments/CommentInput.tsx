'use client'

import React, { useState, useRef, useEffect } from 'react'
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const isLoading = loadingStates[`createComment-${issueId}`]
  const isDisabled = !content.trim() || isLoading

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.max(40, textareaRef.current.scrollHeight)}px`
    }
  }, [content])

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
    <div className="space-y-2">
      <div className="flex gap-2 items-end">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-card dark:bg-card shadow-none focus-visible:ring-0 focus-visible:ring-offset-0  min-h-[40px] max-h-[120px] resize-none text-xs transition-all duration-200"
          disabled={isLoading}
        />
        <Button
          onClick={handleSubmit}
          disabled={isDisabled}
          size="sm"
          className="h-[40px] w-[40px] p-0 flex-shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
} 