import { Bold, Italic, Underline, Strikethrough, Link, Code } from 'lucide-react'
import { useState } from 'react'

const BubbleMenuComponent = ({ editor }) => {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  const handleSetLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
    }
    setShowLinkInput(false)
    setLinkUrl('')
  }

  if (showLinkInput) {
    return (
      <div 
        className="border rounded-lg p-2 flex items-center space-x-2"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderColor: 'var(--color-border)',
        }}
      >
        <input
          type="text"
          placeholder="Enter URL"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSetLink()
            } else if (e.key === 'Escape') {
              setShowLinkInput(false)
              setLinkUrl('')
            }
          }}
          className="px-2 py-1 rounded text-sm border-none outline-none"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            color: 'var(--color-text)',
          }}
          autoFocus
        />
        <button
          onClick={handleSetLink}
          className="px-2 py-1 rounded text-sm transition-colors"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--color-bright)'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--color-primary)'
          }}
        >
          Set
        </button>
      </div>
    )
  }

  return (
    <div 
      className="border rounded-lg p-1 flex items-center space-x-1"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderColor: 'var(--color-border)',
      }}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="p-2 rounded transition-colors"
        style={{
          backgroundColor: editor.isActive('bold') ? 'var(--color-bg-secondary)' : 'transparent',
          color: editor.isActive('bold') ? 'var(--color-accent)' : 'var(--color-text)',
        }}
        onMouseEnter={(e) => {
          if (!editor.isActive('bold')) {
            e.target.style.backgroundColor = 'var(--color-bg-secondary)'
          }
        }}
        onMouseLeave={(e) => {
          if (!editor.isActive('bold')) {
            e.target.style.backgroundColor = 'transparent'
          }
        }}
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="p-2 rounded transition-colors"
        style={{
          backgroundColor: editor.isActive('italic') ? 'var(--color-bg-secondary)' : 'transparent',
          color: editor.isActive('italic') ? 'var(--color-accent)' : 'var(--color-text)',
        }}
        onMouseEnter={(e) => {
          if (!editor.isActive('italic')) {
            e.target.style.backgroundColor = 'var(--color-bg-secondary)'
          }
        }}
        onMouseLeave={(e) => {
          if (!editor.isActive('italic')) {
            e.target.style.backgroundColor = 'transparent'
          }
        }}
      >
        <Italic size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className="p-2 rounded transition-colors"
        style={{
          backgroundColor: editor.isActive('strike') ? 'var(--color-bg-secondary)' : 'transparent',
          color: editor.isActive('strike') ? 'var(--color-accent)' : 'var(--color-text)',
        }}
        onMouseEnter={(e) => {
          if (!editor.isActive('strike')) {
            e.target.style.backgroundColor = 'var(--color-bg-secondary)'
          }
        }}
        onMouseLeave={(e) => {
          if (!editor.isActive('strike')) {
            e.target.style.backgroundColor = 'transparent'
          }
        }}
      >
        <Strikethrough size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className="p-2 rounded transition-colors"
        style={{
          backgroundColor: editor.isActive('code') ? 'var(--color-bg-secondary)' : 'transparent',
          color: editor.isActive('code') ? 'var(--color-accent)' : 'var(--color-text)',
        }}
        onMouseEnter={(e) => {
          if (!editor.isActive('code')) {
            e.target.style.backgroundColor = 'var(--color-bg-secondary)'
          }
        }}
        onMouseLeave={(e) => {
          if (!editor.isActive('code')) {
            e.target.style.backgroundColor = 'transparent'
          }
        }}
      >
        <Code size={16} />
      </button>
      <button
        onClick={() => setShowLinkInput(true)}
        className="p-2 rounded transition-colors"
        style={{
          backgroundColor: editor.isActive('link') ? 'var(--color-bg-secondary)' : 'transparent',
          color: editor.isActive('link') ? 'var(--color-accent)' : 'var(--color-text)',
        }}
        onMouseEnter={(e) => {
          if (!editor.isActive('link')) {
            e.target.style.backgroundColor = 'var(--color-bg-secondary)'
          }
        }}
        onMouseLeave={(e) => {
          if (!editor.isActive('link')) {
            e.target.style.backgroundColor = 'transparent'
          }
        }}
      >
        <Link size={16} />
      </button>
    </div>
  )
}

export default BubbleMenuComponent