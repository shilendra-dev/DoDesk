import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import Link from '@tiptap/extension-link'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import { useCallback, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import SlashCommands from './SlashCommands'
import BubbleMenuComponent from './BubbleMenuComponent'
import './modern-editor.css'

const ModernEditor = ({ initialContent, onUpdate }) => {
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 })
  const [slashQuery, setSlashQuery] = useState('')

  const debouncedUpdate = useCallback(
    debounce((content) => {
      onUpdate?.(content)
    }, 1000),
    [onUpdate]
  )

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: {
          depth: 100,
        },
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return `Heading ${node.attrs.level}`
          }
          return "Type '/' for commands or start typing"
        },
        showOnlyCurrent: false,
        includeChildren: true,
      }),
      Typography,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'cursor-pointer',
          style: 'color: var(--color-primary); text-decoration: underline;',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'task-list',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'table-auto border-collapse my-4',
          style: 'border: 1px solid var(--color-border);',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'p-2 font-bold',
          style: 'border: 1px solid var(--color-border); background-color: var(--color-bg-secondary);',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'p-2',
          style: 'border: 1px solid var(--color-border);',
        },
      }),
    ],
    content: initialContent || '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] p-4',
      },
      handleKeyDown: (view, event) => {
        // Handle slash command detection
        if (event.key === '/') {
          setTimeout(() => {
            const { state } = view
            const { from } = state.selection
            
            // Get the coordinates for the slash position
            const coords = view.coordsAtPos(from)
            
            // Calculate position relative to the editor container
            const editorElement = view.dom
            const editorRect = editorElement.getBoundingClientRect()
            
            setSlashMenuPosition({ 
              x: coords.left - editorRect.left, 
              y: coords.bottom - editorRect.top + 10 
            })
            setSlashQuery('')
            setShowSlashMenu(true)
          }, 10) // Small delay to ensure the slash character is inserted
          return false // Let the slash character be inserted
        }
        
        // Handle query filtering when slash menu is open
        if (showSlashMenu) {
          if (event.key === 'Escape') {
            event.preventDefault()
            setShowSlashMenu(false)
            return true
          }
          
          if (event.key === 'Backspace') {
            const { state } = view
            const { from } = state.selection
            const textBefore = state.doc.textBetween(Math.max(0, from - 10), from)
            
            if (!textBefore.includes('/')) {
              setShowSlashMenu(false)
            }
            return false
          }
          
          // Filter commands as user types
          if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
            setTimeout(() => {
              const { state } = view
              const { from } = state.selection
              const textBefore = state.doc.textBetween(Math.max(0, from - 20), from)
              const slashMatch = textBefore.match(/\/([^/\s]*)$/)
              
              if (slashMatch) {
                setSlashQuery(slashMatch[1])
              } else {
                setShowSlashMenu(false)
              }
            }, 10)
          }
        }
        
        return false
      },
    },
    onUpdate: ({ editor }) => {
      debouncedUpdate(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent || '')
    }
  }, [editor, initialContent])

  // Close slash menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSlashMenu) {
        // Check if the click is inside the slash menu
        const slashMenu = event.target.closest('.slash-menu')
        if (!slashMenu) {
          setShowSlashMenu(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSlashMenu])

  if (!editor) {
    return null
  }

  return (
    <div className="relative">
      <div 
        className="rounded-lg min-h-[200px]"
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: 'transparent',
          color: 'var(--color-text)',
        }}
      >
        <EditorContent editor={editor} />
        
        <BubbleMenu 
          editor={editor} 
          tippyOptions={{ duration: 100 }}
          shouldShow={({ from, to }) => {
            // Only show when text is selected
            return from !== to
          }}
        >
          <BubbleMenuComponent editor={editor} />
        </BubbleMenu>

        {/* Removed FloatingMenu since / commands work everywhere */}

        {showSlashMenu && (
          <SlashCommands
            editor={editor}
            position={slashMenuPosition}
            query={slashQuery}
            onClose={() => setShowSlashMenu(false)}
          />
        )}
      </div>
    </div>
  )
}

export default ModernEditor