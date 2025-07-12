// frontend/src/providers/TeamContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useWorkspace } from "./WorkspaceContext";

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const { selectedWorkspace } = useWorkspace();

  // Fetch teams when workspace changes
  useEffect(() => {
    if (selectedWorkspace?.id) {
      fetchTeams();
    }
  }, [selectedWorkspace?.id]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5033/api/workspace/${selectedWorkspace.id}/teams`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setTeams(response.data.teams || []);
      
      // Set first team as selected if none selected
      if (!selectedTeam && response.data.teams.length > 0) {
        setSelectedTeam(response.data.teams[0]);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (teamData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5033/api/workspace/${selectedWorkspace.id}/teams`,
        teamData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const newTeam = response.data.team;
      setTeams(prev => [newTeam, ...prev]);
      setSelectedTeam(newTeam);
      
      return newTeam;
    } catch (error) {
      console.error("Error creating team:", error);
      throw error;
    }
  };

  return (
    <TeamContext.Provider value={{
      teams,
      selectedTeam,
      setSelectedTeam,
      loading,
      createTeam,
      fetchTeams
    }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => useContext(TeamContext);