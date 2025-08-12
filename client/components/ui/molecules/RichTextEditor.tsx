'use client'

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import Heading from '@tiptap/extension-heading'
import Blockquote from '@tiptap/extension-blockquote'
import CodeBlock from '@tiptap/extension-code-block'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
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
  const [slashCommandRange, setSlashCommandRange] = useState<{ from: number; to: number } | null>(null)
  const [slashCommandPosition, setSlashCommandPosition] = useState<{ x: number; y: number } | null>(null)
  const updateTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const lastContentRef = useRef<string>(initialContent)
  const editorRef = useRef<Editor | null>(null)

  const debouncedUpdate = useCallback((content: string) => {
    if (!onUpdate) return
    
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      if (content !== lastContentRef.current) {
        lastContentRef.current = content
        onUpdate(content)
      }
    }, debounceMs)
  }, [onUpdate, debounceMs])

  const handleSlashCommandClose = useCallback(() => {
    setShowSlashCommands(false)
    setSlashCommandRange(null)
    setSlashCommandPosition(null)
  }, [])

  // Handle slash detection through cursor position
  // const handleSlashDetection = useCallback(() => { ... }, [])

  // Handle Cmd+/ or Ctrl+/ keyboard shortcut
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Check for Cmd+/ (Mac) or Ctrl+/ (Windows/Linux)
    if (event.key === '/' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault() // Prevent the / from being typed
      
      if (editorRef.current) {
        const { state } = editorRef.current.view
        const { selection } = state
        const { from, to } = selection
        
        // Only trigger on single character selection
        if (from !== to) return
        
        // Calculate position at current cursor
        const coords = editorRef.current.view.coordsAtPos(from)
        let x = coords.left
        let y = coords.bottom + 10
        
        const menuWidth = 224
        const menuHeight = 256
        
        if (x + menuWidth > window.innerWidth) {
          x = window.innerWidth - menuWidth - 10
        }
        if (y + menuHeight > window.innerHeight) {
          y = coords.top - menuHeight - 10
        }
        
        // Set state and show menu
        setSlashCommandPosition({ x, y })
        setSlashCommandRange({ from, to })
        setShowSlashCommands(true)
        
        console.log('Slash command triggered via keyboard shortcut:', { position: { x, y } })
      }
    }
  }, [])

  const editorConfig = useMemo(() => ({
    extensions: [
      StarterKit.configure({
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
    ],
    content: initialContent,
    onUpdate: ({ editor }: { editor: Editor }) => {
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
  }), [initialContent, debouncedUpdate, readOnly])

  const editor = useEditor(editorConfig)
  
  useEffect(() => {
    if (editor) {
      editorRef.current = editor
      
      // Add keyboard shortcut listener
      const editorElement = editor.view.dom
      editorElement.addEventListener('keydown', handleKeyDown)
      
      return () => {
        editorElement.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [editor, handleKeyDown])

  useEffect(() => {
    if (editor && initialContent !== lastContentRef.current) {
      const currentContent = editor.getHTML()
      if (initialContent !== currentContent) {
        editor.commands.setContent(initialContent, { emitUpdate: false })
        lastContentRef.current = initialContent
      }
    }
  }, [initialContent, editor])

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
    <>
      <div className={cn("relative", className)}>
        <EditorContent
          editor={editor}
          className=" focus:outline-none"
        />
        
        {showSlashCommands && slashCommandPosition && typeof window !== 'undefined' && createPortal(
          <SlashCommandsComponent
            editor={editor}
            isOpen={showSlashCommands}
            onClose={handleSlashCommandClose}
            slashRange={slashCommandRange}
            position={slashCommandPosition}
          />,
          document.body
        )}
      </div>
      
      {/* Keyboard Shortcut Hint Bubble */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <kbd className="px-1.5 py-0.5 bg-background/50 border border-border rounded text-[14px] font-mono">
            {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+/
          </kbd>
          <span className="text-[12px]">Show commands</span>
        </div>
      </div>
    </>
  )
} 