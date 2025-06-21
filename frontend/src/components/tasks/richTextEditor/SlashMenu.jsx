// SlashMenu.jsx
import React, { useEffect, useRef } from "react";
import { slashCommands } from "./utils/slashMenuConfig";

const SlashMenu = ({ editor, commandQuery, position, onSelect, onClose, direction = "horizontal" }) => {
  const menuRef = useRef(null);
  const filtered = slashCommands.filter(cmd =>
    cmd.title.toLowerCase().includes(commandQuery.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!position || filtered.length === 0) return null;

  return (
    <div
      ref={menuRef}
      className={`absolute z-50 bg-slate-800 text-white rounded shadow-lg text-sm w-52 border border-gray-700 flex ${direction === "vertical" ? "flex-col" : "flex-row"}`}
      style={{ top: position.top + 5, left: position.left }}
    >
      {filtered.map((item, index) => (
        <div
          key={index}
          className="px-3 py-2 hover:bg-slate-700 cursor-pointer"
          onMouseDown={(e) => {
            e.preventDefault();
            const { state, commands } = editor;
            const { from } = state.selection;
            const slashPos = from - 1;
            const charBefore = state.doc.textBetween(slashPos, from);

            if (charBefore === "/") {
              commands.deleteRange({ from: slashPos, to: from });
            }

            item.command({ editor });
            onSelect();
          }}
        >
          {item.title}
        </div>
      ))}
    </div>
  );
};

export default SlashMenu;