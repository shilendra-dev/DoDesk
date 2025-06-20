import { debounce } from 'lodash';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useCallback } from 'react';
import Placeholder from '@tiptap/extension-placeholder';

const NotesEditor = ({ initialContent, onUpdate }) => {
    const debouncedUpdate = useCallback(
      debounce((editorInstance) => {
        const html = editorInstance.getHTML();
        onUpdate(html);
      }, 1000),
      [onUpdate]
    );

    const editor = useEditor({
        extensions: [StarterKit,
            Placeholder.configure({
                placeholder: 'Start typing... / Add notes here',
            })
        ],
        content: initialContent || '',
        onUpdate: ({ editor }) => debouncedUpdate(editor),
    });
    
    useEffect(() => {
        if( editor && initialContent != editor.getHTML()){
            editor.commands.setContent(initialContent || '');
        }
    },[editor, initialContent]);

return (
  <div className="flex-1">
    {/* Override Tiptap ProseMirror default styles */}
    <style>
    {`
      .ProseMirror {
        outline: none;
        white-space: pre-wrap;
        word-break: break-word;
        min-height: inherit;
        padding: 0;
        margin: 0;
      }

      .ProseMirror p.is-empty::before {
        content: attr(data-placeholder);
        float: left;
        color: #94a3b8; /* Tailwind slate-400 */
        opacity: 0.5;
        pointer-events: none;
        height: 0;
      }
    `}
    </style>
    <div className="bg-[#1e293b] text-gray-200 rounded-lg px-4 py-3 min-h-[120px] w-full 
    resize-none placeholder-gray-500 focus-within:ring-2 focus-within:ring-blue-500 
    transition-all duration-200 ease-in-out border border-gray-700 hover:border-gray-600">
      <EditorContent
        editor={editor}
        className="w-full h-full outline-none"
      />
    </div>
  </div>
);
}
export default NotesEditor;