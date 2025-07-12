// frontend/src/components/TeamSwitcher.jsx
import { useState } from "react";
import { useTeam } from "../../../providers/TeamContext";
import { ChevronDown, Plus } from "lucide-react";

const TeamSwitcher = () => {
  const { teams, selectedTeam, setSelectedTeam } = useTeam();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        {selectedTeam ? (
          <>
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedTeam.color }}
            />
            <span className="font-medium">{selectedTeam.name}</span>
          </>
        ) : (
          <span>Select Team</span>
        )}
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-2">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => {
                  setSelectedTeam(team);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  selectedTeam?.id === team.id ? 'bg-blue-50 dark:bg-blue-900' : ''
                }`}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: team.color }}
                />
                <div className="flex-1">
                  <div className="font-medium">{team.name}</div>
                  <div className="text-sm text-gray-500">{team.key}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSwitcher;