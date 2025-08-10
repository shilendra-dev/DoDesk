'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/atoms/button'
import { Bold, Italic, List, ListOrdered } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IssueNotesProps {
  initialContent: string
  onUpdate: (content: string) => void
}

export function IssueNotes({ initialContent, onUpdate }: IssueNotesProps) {
  const updateTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const isUpdatingRef = useRef(false)
  const onUpdateRef = useRef<((content: string) => void) | null>(null)

  // Update the ref when onUpdate changes
  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  const debouncedUpdate = useCallback((content: string) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      if (!isUpdatingRef.current) {
        onUpdateRef.current?.(content)
      }
    }, 500) // 500ms debounce
  }, []) // Add empty dependency array

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Add description...',
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      debouncedUpdate(html)
    },
    immediatelyRender: false, // Fix SSR hydration mismatch
    editorProps: {
      attributes: {
        class: 'min-h-[60px] focus:outline-none text-sm leading-relaxed',
      },
    },
  })

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML() && !isUpdatingRef.current) {
      isUpdatingRef.current = true
      editor.commands.setContent(initialContent) // Remove emitUpdate option
      isUpdatingRef.current = false
    }
  }, [initialContent, editor])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [])

  if (!editor) {
    return (
      <div className="min-h-[60px] text-sm text-muted-foreground">
        <div>Loading editor...</div>
      </div>
    )
  }

  const MenuBar = () => (
    <div className="flex items-center gap-1 mb-3 opacity-0 hover:opacity-100 transition-opacity group-hover:opacity-100">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "h-7 w-7 p-0 hover:bg-muted/50",
          editor.isActive('bold') && "bg-muted/50"
        )}
      >
        <Bold size={12} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          "h-7 w-7 p-0 hover:bg-muted/50",
          editor.isActive('italic') && "bg-muted/50"
        )}
      >
        <Italic size={12} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "h-7 w-7 p-0 hover:bg-muted/50",
          editor.isActive('bulletList') && "bg-muted/50"
        )}
      >
        <List size={12} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "h-7 w-7 p-0 hover:bg-muted/50",
          editor.isActive('orderedList') && "bg-muted/50"
        )}
      >
        <ListOrdered size={12} />
      </Button>
    </div>
  )

  return (
    <div className="group">
      <MenuBar />
      <div className="min-h-[60px]">
        <EditorContent
          editor={editor}
          className="min-h-[60px] focus:outline-none text-sm leading-relaxed"
        />
      </div>
    </div>
  )
}