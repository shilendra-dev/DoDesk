'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import Heading from '@tiptap/extension-heading'
import Blockquote from '@tiptap/extension-blockquote'
import CodeBlock from '@tiptap/extension-code-block'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Image from '@tiptap/extension-image'
import { SlashCommands } from './SlashCommandsExtension'
import { SlashCommands as SlashCommandsComponent } from './SlashCommands'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  initialContent?: string
  placeholder?: string
  onUpdate?: (content: string) => void
  debounceMs?: number
  className?: string
  readOnly?: boolean
}

export function RichTextEditor({
  initialContent = '',
  placeholder = 'Start typing...',
  onUpdate,
  debounceMs = 500,
  className = '',
  readOnly = false
}: RichTextEditorProps) {
  const [showSlashCommands, setShowSlashCommands] = useState(false)
  const updateTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const lastContentRef = useRef<string>(initialContent)

  // Debounced update function
  const debouncedUpdate = useCallback((content: string) => {
    if (!onUpdate) return
    
    // Clear existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    
    // Set new timeout
    updateTimeoutRef.current = setTimeout(() => {
      // Only update if content has actually changed
      if (content !== lastContentRef.current) {
        lastContentRef.current = content
        onUpdate(content)
      }
    }, debounceMs)
  }, [onUpdate, debounceMs])

  const handleSlashCommand = useCallback((_query: string, _range: { from: number; to: number }) => {
    setShowSlashCommands(true)
  }, [])

  const handleSlashCommandClose = useCallback(() => {
    setShowSlashCommands(false)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable some extensions to customize them
        bulletList: false,
        orderedList: false,
        listItem: false,
        codeBlock: false,
        heading: false,
        blockquote: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'underline cursor-pointer',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Blockquote,
      CodeBlock,
      ListItem,
      BulletList,
      OrderedList,
      Image,
      SlashCommands.configure({
        onSlash: handleSlashCommand,
        trigger: '/',
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      debouncedUpdate(html)
    },
    editable: !readOnly,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap min-h-[100px] focus:outline-none',
      },
    },
  })

  // Update editor content when initialContent changes (but only if it's different)
  useEffect(() => {
    if (editor && initialContent !== lastContentRef.current) {
      const currentContent = editor.getHTML()
      if (initialContent !== currentContent) {
        editor.commands.setContent(initialContent, { emitUpdate: false })
        lastContentRef.current = initialContent
      }
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
      <div className={cn("min-h-[100px] text-sm", className)}>
        <div>Loading editor...</div>
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      <EditorContent
        editor={editor}
        className="min-h-[100px] focus:outline-none"
      />
      {showSlashCommands && editor && (
        <SlashCommandsComponent
          editor={editor}
          isOpen={showSlashCommands}
          onClose={handleSlashCommandClose}
        />
      )}
    </div>
  )
} 