import { useState } from "react";

export function useSaveFilterModal() {
  const [showSaveFilterModal, setShowSaveFilterModal] = useState(false);
  const [newFilterName, setNewFilterName] = useState("");

  const openModal = () => setShowSaveFilterModal(true);
  const closeModal = () => {
    setShowSaveFilterModal(false);
    setNewFilterName("");
  };

  return {
    showSaveFilterModal,
    setShowSaveFilterModal,
    newFilterName,
    setNewFilterName,
    openModal,
    closeModal,
  };
}