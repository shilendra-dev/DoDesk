import { createPortal } from "react-dom";
import BadgeLabel from "../atoms/BadgeLabel";

export default function InlineDropdown({
  position,
  options,
  type,
  onSelect,
  onClose,
}) {
  if (!position) return null;
  return createPortal(
    <div
      className="fixed z-[9999] bg-[#1f2937] border border-gray-700 rounded shadow-md p-1 min-w-max"
      style={{ top: position.y + 4, left: position.x }}
      onClick={e => e.stopPropagation()}
    >
      {options.map((option) => (
        <div
          key={typeof option === "object" ? option.value : option}
          onClick={() => {
            onSelect(option);
            onClose();
          }}
          className="px-2 py-1 hover:bg-gray-600 cursor-pointer rounded"
        >
          <BadgeLabel type={type} value={option.value} />
        </div>
      ))}
    </div>,
    document.body
  );
}