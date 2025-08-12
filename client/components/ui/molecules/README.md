# Rich Text Editor Components

This directory contains a modern, feature-rich rich text editor built with Tiptap, following best practices for performance, accessibility, and user experience.

## Components

### RichTextEditor

The main rich text editor component that provides a clean, modern editing experience.

**Features:**
- 🎯 **Bubble Menu**: Contextual formatting options that appear when text is selected
- ⚡ **Slash Commands**: Type `/` to access a command palette with various formatting options
- 📝 **Rich Formatting**: Support for headings, lists, tables, links, code blocks, and more
- 🎨 **Modern UI**: Clean interface with dark mode support
- 📱 **Responsive**: Works seamlessly across different screen sizes
- ♿ **Accessible**: Built with accessibility best practices

**Props:**
```typescript
interface RichTextEditorProps {
  initialContent?: string        // Initial HTML content
  placeholder?: string           // Placeholder text when empty
  onUpdate?: (content: string)  // Callback when content changes
  debounceMs?: number           // Debounce delay for updates (default: 500ms)
  className?: string            // Additional CSS classes
  readOnly?: boolean            // Whether the editor is read-only
}
```

**Usage:**
```tsx
import { RichTextEditor } from '@/components/ui/molecules/RichTextEditor'

function MyComponent() {
  const [content, setContent] = useState('')

  return (
    <RichTextEditor
      initialContent={content}
      placeholder="Start typing..."
      onUpdate={setContent}
      debounceMs={300}
      className="min-h-[200px]"
    />
  )
}
```

### SlashCommands

A command palette component that appears when typing `/` in the editor.

**Features:**
- 🔍 **Search**: Filter commands by typing
- ⌨️ **Keyboard Navigation**: Use arrow keys, Enter, and Escape
- 📱 **Touch Friendly**: Works well on mobile devices
- 🎨 **Modern Design**: Clean, accessible interface

**Commands Available:**
- **Headings**: H1, H2, H3
- **Lists**: Bullet, Numbered, Task
- **Blocks**: Quote, Code Block
- **Media**: Table, Link, Image

### SlashCommandsExtension

A custom Tiptap extension that handles slash command detection and triggers.

## How It Works

### Bubble Menu
1. Select any text in the editor
2. A floating toolbar appears above the selection
3. Click formatting options to apply them
4. Menu automatically hides when selection changes

### Slash Commands
1. Type `/` anywhere in the editor
2. Command palette appears with available options
3. Use arrow keys to navigate, Enter to select
4. Type to search through commands
5. Escape to close without selecting

### Extensions Used
- **StarterKit**: Basic editor functionality
- **Placeholder**: Shows placeholder text when empty
- **Link**: Hyperlink support
- **TaskList/TaskItem**: Checkbox lists
- **Table**: Table creation and editing
- **Heading**: Multiple heading levels
- **Blockquote**: Quote blocks
- **CodeBlock**: Code blocks
- **Image**: Image insertion

## Styling

The editor uses Tailwind CSS classes and custom CSS for ProseMirror elements. All styles are included in `globals.css` and follow the design system.

### Customization
You can customize the appearance by:
1. Modifying the CSS classes in the components
2. Updating the ProseMirror styles in `globals.css`
3. Overriding Tailwind classes with the `className` prop

## Best Practices

### Performance
- Content updates are debounced to prevent excessive re-renders
- Editor state is managed efficiently with React hooks
- Extensions are configured for optimal performance

### Accessibility
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- High contrast support

### User Experience
- Intuitive interface design
- Responsive feedback
- Consistent behavior across devices
- Modern interaction patterns

## Examples

See `RichTextEditorDemo.tsx` for a comprehensive example of all features.

## Dependencies

- `@tiptap/react`: Core Tiptap React integration
- `@tiptap/starter-kit`: Basic editor extensions
- `@tiptap/extension-*`: Various formatting extensions
- `lucide-react`: Icons
- `tailwindcss`: Styling

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled

## Contributing

When adding new features:
1. Follow the existing component structure
2. Maintain accessibility standards
3. Add proper TypeScript types
4. Include comprehensive documentation
5. Test across different devices and browsers 