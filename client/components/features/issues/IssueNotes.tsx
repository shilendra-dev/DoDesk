'use client'

import React from 'react'
import { RichTextEditor } from '@/components/ui/molecules/RichTextEditor'

interface IssueNotesProps {
  initialContent: string
  onUpdate: (content: string) => void
}

export function IssueNotes({ initialContent, onUpdate }: IssueNotesProps) {
  return (
    <RichTextEditor
      initialContent={initialContent}
      placeholder="Add description..."
      onUpdate={onUpdate}
      debounceMs={500}
      className="min-h-[60px]"
    />
  )
}