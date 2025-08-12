'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Editor } from '@tiptap/react'
import { 
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Link as LinkIcon,
  List,
  ListOrdered,
  CheckSquare,
  Table as TableIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SlashCommand {
  title: string
  description: string
  icon: React.ReactNode
  command: (editor: Editor) => void
  keywords: string[]
}

interface SlashCommandsProps {
  editor: Editor
  isOpen: boolean
  onClose: () => void
  slashRange?: { from: number; to: number } | null
  position?: { x: number; y: number } | null
}

export function SlashCommands({ editor, isOpen, onClose, slashRange, position }: SlashCommandsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [search, setSearch] = useState('')
  const [isClosing, setIsClosing] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 150)
  }, [onClose])

  const executeCommand = useCallback((command: SlashCommand) => {
    // Remove the slash character first
    if (slashRange) {
      editor.chain().focus().deleteRange(slashRange).run()
    }
    // Execute the command
    command.command(editor)
    // Close the menu smoothly
    handleClose()
  }, [editor, slashRange, handleClose])

  const commands: SlashCommand[] = [
    {
      title: 'Heading 1',
      description: 'Large section heading',
      icon: <Heading1 size={16} />,
      command: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      keywords: ['h1', 'heading', 'title', 'large']
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading',
      icon: <Heading2 size={16} />,
      command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      keywords: ['h2', 'heading', 'subtitle', 'medium']
    },
    {
      title: 'Heading 3',
      description: 'Small section heading',
      icon: <Heading3 size={16} />,
      command: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      keywords: ['h3', 'heading', 'subtitle', 'small']
    },
    {
      title: 'Bullet List',
      description: 'Create a bullet list',
      icon: <List size={16} />,
      command: (editor) => editor.chain().focus().toggleBulletList().run(),
      keywords: ['ul', 'bullet', 'list', 'unordered']
    },
    {
      title: 'Numbered List',
      description: 'Create a numbered list',
      icon: <ListOrdered size={16} />,
      command: (editor) => editor.chain().focus().toggleOrderedList().run(),
      keywords: ['ol', 'number', 'list', 'ordered']
    },
    {
      title: 'Task List',
      description: 'Create a task list',
      icon: <CheckSquare size={16} />,
      command: (editor) => editor.chain().focus().toggleTaskList().run(),
      keywords: ['task', 'todo', 'checklist', 'checkbox']
    },
    {
      title: 'Quote',
      description: 'Create a quote block',
      icon: <Quote size={16} />,
      command: (editor) => editor.chain().focus().toggleBlockquote().run(),
      keywords: ['quote', 'blockquote', 'citation']
    },
    {
      title: 'Code Block',
      description: 'Create a code block',
      icon: <Code size={16} />,
      command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
      keywords: ['code', 'block', 'snippet', 'programming']
    },
    {
      title: 'Table',
      description: 'Insert a table',
      icon: <TableIcon size={16} />,
      command: (editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
      keywords: ['table', 'grid', 'data', 'spreadsheet']
    },
    {
      title: 'Link',
      description: 'Add a link',
      icon: <LinkIcon size={16} />,
      command: (editor) => {
        const url = window.prompt('Enter URL')
        if (url) {
          editor.chain().focus().setLink({ href: url }).run()
        }
      },
      keywords: ['link', 'url', 'hyperlink', 'website']
    },
  ]

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(search.toLowerCase()) ||
    command.description.toLowerCase().includes(search.toLowerCase()) ||
    command.keywords.some(keyword => keyword.toLowerCase().includes(search.toLowerCase()))
  )

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0)
      setSearch('')
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          handleClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands, executeCommand, handleClose])

  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  // Handle click outside to close
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('click', handleClickOutside)
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      className={cn(
        "bg-background/95 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg w-56 max-h-64 overflow-hidden transition-all duration-150",
        isClosing 
          ? "animate-out fade-out-0 zoom-out-95" 
          : "animate-in fade-in-0 zoom-in-95"
      )}
      style={{
        position: 'fixed',
        left: position ? `${position.x}px` : '50%',
        top: position ? `${position.y}px` : '50%',
        transform: position ? 'none' : 'translate(-50%, -50%)',
        zIndex: 1000
      }}
    >
      <div className="px-3 py-2 border-b border-border/30 bg-gradient-to-r from-background to-muted/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary/60 rounded-full"></div>
          <input
            type="text"
            placeholder="Type to search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-2 py-1 text-xs bg-transparent border-none outline-none placeholder:text-muted-foreground/60"
            autoFocus
          />
        </div>
      </div>
      
      <div className="max-h-52 overflow-y-auto" ref={listRef}>
        {filteredCommands.length === 0 ? (
          <div className="px-3 py-4 text-center text-muted-foreground/70 text-xs">
            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-muted/50 flex items-center justify-center">
              <span className="text-muted-foreground/50">?</span>
            </div>
            No commands found
          </div>
        ) : (
          filteredCommands.map((command, index) => (
            <button
              key={command.title}
              onClick={() => executeCommand(command)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-accent/50 transition-all duration-150 group",
                index === selectedIndex && "bg-accent/50 border-l-2 border-l-primary"
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all duration-150",
                index === selectedIndex 
                  ? "bg-primary/20 text-primary" 
                  : "bg-muted/50 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
              )}>
                {command.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "font-medium text-xs transition-colors duration-150",
                  index === selectedIndex 
                    ? "text-primary font-semibold" 
                    : "text-foreground group-hover:text-foreground"
                )}>
                  {command.title}
                </div>
              </div>
              {index === selectedIndex && (
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
              )}
            </button>
          ))
        )}
      </div>
      
      <div className="px-3 py-2 border-t border-border/30 text-[10px] text-muted-foreground/50 text-center bg-gradient-to-r from-muted/10 to-transparent">
        <span className="inline-flex items-center gap-1">
          <span className="w-1 h-1 bg-primary/40 rounded-full"></span>
          ↑↓ navigate • Enter select • Esc close
          <span className="w-1 h-1 bg-primary/40 rounded-full"></span>
        </span>
      </div>
    </div>
  )
} 