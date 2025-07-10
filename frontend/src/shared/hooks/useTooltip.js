import { useState } from "react";

export function useTooltip() {
  const [tooltip, setTooltip] = useState({ visible: false, name: "", x: 0, y: 0 });

  const showTooltip = (name, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      name,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  const hideTooltip = () => {
    setTooltip({ visible: false, name: "", x: 0, y: 0 });
  };

  return { tooltip, showTooltip, hideTooltip };
}