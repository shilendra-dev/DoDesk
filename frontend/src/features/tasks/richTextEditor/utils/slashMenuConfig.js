export const slashCommands = [
  {
    title: "Heading 1",
    command: ({ editor }) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: "Heading 2",
    command: ({ editor }) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: "Numbered List",
    command: ({ editor }) =>
      editor.chain().focus().toggleOrderedList().run(),
  },
  {
    title: "Divider",
    command: ({ editor }) =>
      editor.chain().focus().setHorizontalRule().run(),
  },
  {
    title: "Todo",
    command: ({ editor }) => {
      // Simple implementation like the official docs
      editor.chain().focus().toggleTaskList().run();
    },
  },
];