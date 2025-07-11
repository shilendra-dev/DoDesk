import { useState, useEffect } from 'react'
import { 
  Heading1, Heading2, Heading3, List, ListOrdered, 
  Quote, Image, CheckSquare, Minus,
  Type
} from 'lucide-react'

const SlashCommands = ({ editor, position, query, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const commands = [
    {
      title: 'Text',
      description: 'Start writing with plain text',
      icon: Type,
      command: () => {
        // Simplified approach - just delete slash and set paragraph
        const { state } = editor
        const { from } = state.selection
        
        // Find and delete the slash
        const textBefore = state.doc.textBetween(Math.max(0, from - 10), from)
        const slashIndex = textBefore.lastIndexOf('/')
        
        if (slashIndex !== -1) {
          const slashPos = from - (textBefore.length - slashIndex)
          editor.chain().focus().deleteRange({ from: slashPos, to: from }).setParagraph().run()
        } else {
          editor.chain().focus().setParagraph().run()
        }
        
        onClose()
      },
    },
    {
      title: 'Heading 1',
      description: 'Big section heading',
      icon: Heading1,
      command: () => {
        // Simplified approach
        const { state } = editor
        const { from } = state.selection
        
        // Find and delete the slash
        const textBefore = state.doc.textBetween(Math.max(0, from - 10), from)
        const slashIndex = textBefore.lastIndexOf('/')
        
        if (slashIndex !== -1) {
          const slashPos = from - (textBefore.length - slashIndex)
          editor.chain().focus().deleteRange({ from: slashPos, to: from }).setHeading({ level: 1 }).run()
        } else {
          editor.chain().focus().setHeading({ level: 1 }).run()
        }
        
        onClose()
      },
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading',
      icon: Heading2,
      command: () => {
        // Simplified approach
        const { state } = editor
        const { from } = state.selection
        
        // Find and delete the slash
        const textBefore = state.doc.textBetween(Math.max(0, from - 10), from)
        const slashIndex = textBefore.lastIndexOf('/')
        
        if (slashIndex !== -1) {
          const slashPos = from - (textBefore.length - slashIndex)
          editor.chain().focus().deleteRange({ from: slashPos, to: from }).setHeading({ level: 2 }).run()
        } else {
          editor.chain().focus().setHeading({ level: 2 }).run()
        }
        
        onClose()
      },
    },
    {
      title: 'Heading 3',
      description: 'Small section heading',
      icon: Heading3,
      command: () => {
        const { state } = editor
        const { from } = state.selection
        
        const textBefore = state.doc.textBetween(Math.max(0, from - 10), from)
        const slashIndex = textBefore.lastIndexOf('/')
        
        if (slashIndex !== -1) {
          const slashPos = from - (textBefore.length - slashIndex)
          editor.chain().focus().deleteRange({ from: slashPos, to: from }).setHeading({ level: 3 }).run()
        } else {
          editor.chain().focus().setHeading({ level: 3 }).run()
        }
        
        onClose()
      },
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list',
      icon: List,
      command: () => {
        const { state } = editor
        const { from } = state.selection
        
        const textBefore = state.doc.textBetween(Math.max(0, from - 10), from)
        const slashIndex = textBefore.lastIndexOf('/')
        
        if (slashIndex !== -1) {
          const slashPos = from - (textBefore.length - slashIndex)
          editor.chain().focus().deleteRange({ from: slashPos, to: from }).toggleBulletList().run()
        } else {
          editor.chain().focus().toggleBulletList().run()
        }
        
        onClose()
      },
    },
    {
      title: 'Numbered List',
      description: 'Create a list with numbering',
      icon: ListOrdered,
      command: () => {
        const { state } = editor
        const { from } = state.selection
        
        const textBefore = state.doc.textBetween(Math.max(0, from - 10), from)
        const slashIndex = textBefore.lastIndexOf('/')
        
        if (slashIndex !== -1) {
          const slashPos = from - (textBefore.length - slashIndex)
          editor.chain().focus().deleteRange({ from: slashPos, to: from }).toggleOrderedList().run()
        } else {
          editor.chain().focus().toggleOrderedList().run()
        }
        
        onClose()
      },
    },
    {
      title: 'To-do List',
      description: 'Track tasks with a to-do list',
      icon: CheckSquare,
      command: () => {
        const { state } = editor
        const { from } = state.selection
        
        const textBefore = state.doc.textBetween(Math.max(0, from - 10), from)
        const slashIndex = textBefore.lastIndexOf('/')
        
        if (slashIndex !== -1) {
          const slashPos = from - (textBefore.length - slashIndex)
          editor.chain().focus().deleteRange({ from: slashPos, to: from }).toggleTaskList().run()
        } else {
          editor.chain().focus().toggleTaskList().run()
        }
        
        onClose()
      },
    },
    {
      title: 'Quote',
      description: 'Capture a quote',
      icon: Quote,
      command: () => {
        const { state } = editor
        const { from } = state.selection
        
        const textBefore = state.doc.textBetween(Math.max(0, from - 10), from)
        const slashIndex = textBefore.lastIndexOf('/')
        
        if (slashIndex !== -1) {
          const slashPos = from - (textBefore.length - slashIndex)
          editor.chain().focus().deleteRange({ from: slashPos, to: from }).toggleBlockquote().run()
        } else {
          editor.chain().focus().toggleBlockquote().run()
        }
        
        onClose()
      },
    },
    {
      title: 'Divider',
      description: 'Visually divide blocks',
      icon: Minus,
      command: () => {
        const { state } = editor
        const { from } = state.selection
        
        const textBefore = state.doc.textBetween(Math.max(0, from - 10), from)
        const slashIndex = textBefore.lastIndexOf('/')
        
        if (slashIndex !== -1) {
          const slashPos = from - (textBefore.length - slashIndex)
          editor.chain().focus().deleteRange({ from: slashPos, to: from }).setHorizontalRule().run()
        } else {
          editor.chain().focus().setHorizontalRule().run()
        }
        
        onClose()
      },
    },
  ]

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.description.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length)
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
      } else if (event.key === 'Enter') {
        event.preventDefault()
        filteredCommands[selectedIndex]?.command()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [filteredCommands, selectedIndex])

  if (filteredCommands.length === 0) {
    return null
  }

  // Calculate optimal position to avoid viewport overflow
  const calculatePosition = () => {
    const menuHeight = Math.min(320, filteredCommands.length * 40 + 8) // Approximate height: 40px per item + padding
    const menuWidth = 240
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    
    let left = Math.max(10, position.x)
    let top = position.y
    
    // Ensure menu doesn't go off the right side
    if (left + menuWidth > viewportWidth - 10) {
      left = viewportWidth - menuWidth - 10
    }
    
    // Check if menu would go off the bottom of the viewport
    if (top + menuHeight > viewportHeight - 10) {
      // Position above the cursor instead
      top = position.y - menuHeight - 10
      
      // If positioning above would go off the top, position at the bottom with some margin
      if (top < 10) {
        top = Math.max(10, viewportHeight - menuHeight - 10)
      }
    }
    
    return { left, top }
  }

  const { left, top } = calculatePosition()

  return (
    <div
      className="slash-menu absolute z-50 border rounded-lg shadow-xl py-1 min-w-[240px] max-h-[320px] overflow-y-auto"
      style={{ 
        left,
        top,
        maxWidth: 'calc(100vw - 20px)',
        backgroundColor: 'var(--color-bg)',
        borderColor: 'var(--color-border)',
      }}
      onMouseDown={(e) => {
        // Prevent the menu from closing when clicking inside
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {filteredCommands.map((command, index) => {
        const Icon = command.icon
        return (
          <button
            key={command.title}
            className={`w-full px-3 py-2 text-left flex items-center space-x-2 transition-colors ${
              index === selectedIndex ? 'opacity-100' : 'opacity-90'
            }`}
            style={{
              backgroundColor: index === selectedIndex ? 'var(--color-bg-secondary)' : 'transparent',
              color: 'var(--color-text)',
            }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              command.command()
            }}
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <Icon size={16} style={{ color: 'var(--color-text-secondary)' }} className="flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>{command.title}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{command.description}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default SlashCommands