import { createPortal } from "react-dom";

export default function Tooltip({ visible, x, y, content }) {
  if (!visible) return null;
  return createPortal(
    <div
      className="fixed px-3 py-1.5 text-xs text-white bg-black/70 backdrop-blur-sm rounded-md z-[9999] shadow-lg border border-gray-600"
      style={{
        top: y,
        left: x,
        transform: "translate(-50%, -100%)",
        whiteSpace: "nowrap",
      }}
    >
      {content}
    </div>,
    document.body
  );
}