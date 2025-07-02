import { debounce } from "lodash";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useEffect, useCallback, memo, useState, useRef } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, Undo, Redo } from "lucide-react";
import SlashMenu from "./SlashMenu";
import "./styles/editor.css";

const NotesEditor = memo(({ initialContent, onUpdate }) => {
  const debouncedUpdate = useCallback(
    debounce((editorInstance) => {
      if (!editorInstance) return;
      const html = editorInstance.getHTML();
      onUpdate(html);
    }, 1000),
    [onUpdate]
  );

  // State to manage slash command input and menu position
  const [slashQuery, setSlashQuery] = useState("");
  const [menuPos, setMenuPos] = useState(null);
  const editorRef = useRef();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: true,
        heading: {
          levels: [1, 2],
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item',
        },
      }),

      Placeholder.configure({
        placeholder: "Start typing... / Add notes here",
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none",
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          const state = view.state;
          const { selection } = state;

          if (event.key === "/") {
            // Wait for Tiptap to insert the character before measuring position
            setTimeout(() => {
              const coords = view.coordsAtPos(view.state.selection.to );
              setMenuPos({ top: coords.bottom + 4, left: coords.left - 110 });
              setSlashQuery(""); // No filtering for now
            }, 0);
          } else {
            const textBefore = state.doc.textBetween(
              Math.max(0, selection.from - 50),
              selection.from,
              "\n",
              "\0"
            );

            const slashMatch = textBefore.match(/\/$/);
            if (!slashMatch) {
              setSlashQuery("");
              setMenuPos(null);
            }
          }
        },
      },
    },
    content: initialContent || "",
    onUpdate: ({ editor }) => {
      if (editor) {
        debouncedUpdate(editor);
      }
    },
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent || "");
    }
  }, [editor, initialContent]);

  // Cleanup function to destroy editor on unmount
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const handleButtonClick = (callback) => {
    if (!editor?.chain()?.focus()) return;
    callback();
  };

  return (
    <div className="flex-1">
      <div
        className="bg-transparent text-gray-200 rounded-lg mt-2 px-4 py-3 min-h-[150px] w-full 
        resize-none placeholder-gray-500 outline-none
        transition-all duration-200 ease-in-out border-none"
      >
        {/* Toolbar */}
        <div className="mb-2 text-gray flex text-sm gap-2">
          <button
            onClick={() =>
              handleButtonClick(() => editor.chain().focus().toggleBold().run())
            }
            className={`p-1 pl-0 text-[var(--color-placeholder-text)] hover:text-[var(--color-text)] ${
              editor.isActive("bold") ? "text-[var(--color-text)]" : ""
            }`}
          >
            <Bold size={20} />
          </button>

          <button
            onClick={() =>
              handleButtonClick(() =>
                editor.chain().focus().toggleItalic().run()
              )
            }
            className={`p-1 text-[var(--color-placeholder-text)] hover:text-[var(--color-text)] ${
              editor.isActive("italic") ? "text-[var(--color-text)]" : ""
            }`}
          >
            <Italic size={20} />
          </button>

          <button
            onClick={() =>
              handleButtonClick(() =>
                editor.chain().focus().toggleBulletList().run()
              )
            }
            className={`p-1 text-[var(--color-placeholder-text)] hover:text-[var(--color-text)] ${
              editor.isActive("bulletList") ? "text-[var(--color-text)]" : ""
            }`}
          >
            <List size={20} />
          </button>

          <button
            onClick={() =>
              handleButtonClick(() => editor.chain().focus().undo().run())
            }
            className="p-1 text-[var(--color-placeholder-text)] hover:text-[var(--color-text)]"
          >
            <Undo size={20} />
          </button>

          <button
            onClick={() =>
              handleButtonClick(() => editor.chain().focus().redo().run())
            }
            className="p-1 text-[var(--color-placeholder-text)] hover:text-[var(--color-text)]"
          >
            <Redo size={20} />
          </button>
        </div>
        {/* Editor Content */}
        <div className="bg-transparent text-[var(--color-text)] placeholder-[var(--color-placeholder-text)] py-3  w-full border-none">
          <EditorContent editor={editor} />
          {menuPos && (
            <SlashMenu
              editor={editor}
              commandQuery={slashQuery}
              position={menuPos}
              direction="horizontal"
              onSelect={() => {
                setSlashQuery("");
                setMenuPos(null);
              }}
              onClose={() => {
                setSlashQuery("");
                setMenuPos(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
});

export default NotesEditor;