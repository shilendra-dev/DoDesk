import { Plus } from 'lucide-react'

const FloatingMenuComponent = ({ onOpenSlashMenu }) => {
  const handlePlusClick = () => {
    // Directly trigger the slash menu
    if (onOpenSlashMenu) {
      onOpenSlashMenu()
    }
  }

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-1">
      <button
        onClick={handlePlusClick}
        className="p-2 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
        title="Click to add content"
      >
        <Plus size={16} />
      </button>
    </div>
  )
}

export default FloatingMenuComponent