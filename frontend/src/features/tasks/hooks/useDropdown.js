import { useState } from "react";

export function useDropdown() {
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const [dropdownType, setDropdownType] = useState(null);

  const openDropdown = (position, type) => {
    setDropdownPosition(position);
    setDropdownType(type);
  };
  const closeDropdown = () => {
    setDropdownPosition(null);
    setDropdownType(null);
  };

  return {
    dropdownPosition,
    dropdownType,
    openDropdown,
    closeDropdown,
    setDropdownPosition,
    setDropdownType,
  };
}