import { debounce } from "lodash";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useCallback } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, Undo, Redo } from 'lucide-react';

const NotesEditor = ({ initialContent, onUpdate }) => {
  const debouncedUpdate = useCallback(
    debounce((editorInstance) => {
      const html = editorInstance.getHTML();
      onUpdate(html);
    }, 1000),
    [onUpdate]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start typing... / Add notes here",
      }),
    ],
    content: initialContent || "",
    onUpdate: ({ editor }) => debouncedUpdate(editor),
  });

  useEffect(() => {
    if (editor && initialContent != editor.getHTML()) {
      editor.commands.setContent(initialContent || "");
    }
  }, [editor, initialContent]);

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

      .ProseMirror ul, .ProseMirror ol {
        padding-left: 1.25rem; /* Tailwind's pl-5 */
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        }

        .ProseMirror ul {
            list-style-type: disc;
        }

        .ProseMirror ol {
            list-style-type: decimal;
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

      <div
        className="bg-transparent text-gray-200 rounded-lg mt-2 px-4 py-3 min-h-[150px] w-full 
        resize-none placeholder-gray-500 outline-none
        transition-all duration-200 ease-in-out border-none "
      >
        {/* Toolbar */}
        {editor && (
          <div className="mb-2 text-gray flex text-sm w-full justify-between ">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={` flex-1 rounded-l flex justify-center items-center  text-white px-3 py-2 border border-gray-600  ${editor.isActive('bold') ? 'bg-[#0a1023]' : 'bg-[#10172A] hover:bg-[#0a1023]'}`}>
              <Bold size={16}  />
            </button>

            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`flex-1 flex justify-center items-center  text-white px-3 py-2 border border-gray-600  ${editor.isActive('italic') ? 'bg-[#0a1023]' : 'bg-[#10172A] hover:bg-[#0a1023]'}`}>
              <Italic size={16} />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()} className={`flex-1 flex justify-center items-center  text-white px-3 py-2 border border-gray-600  ${editor.isActive('bulletList') ? 'bg-[#0a1023]' : 'bg-[#10172A] hover:bg-[#0a1023]'}`}>
              <List size={16} />
            </button>

            <button onClick={() => editor.chain().focus().undo().run()} className={`flex-1 flex justify-center items-center  text-white px-3 py-2 border border-gray-600  ${editor.isActive('undo') ? 'bg-[#0a1023]' : 'bg-[#10172A] hover:bg-[#0a1023]'}`}>
              <Undo size={16} />
            </button>

            <button onClick={() => editor.chain().focus().redo().run()} className={`flex-1 rounded-r flex justify-center items-center  text-white px-3 py-2 border border-gray-600  ${editor.isActive('redo') ? 'bg-[#0a1023]' : 'bg-[#10172A] hover:bg-[#0a1023]'}`}>
              <Redo size={16} />
            </button>
          </div>
        )}

        {/* Editor Content */}
        <EditorContent editor={editor} className="w-full h-full outline-none" />
      </div>
    </div>
  );
};
export default NotesEditor;
