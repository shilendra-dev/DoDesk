import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const token = localStorage.getItem('token');

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user and workspaces on page reload
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('http://localhost:5033/api/workspaces',  {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
        setWorkspaces(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user/workspaces:', err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Set workspaces and default selected workspace
  const initializeWorkspaces = (workspaces) => {
    // Make sure workspaces is an array before accessing its length
    if (!Array.isArray(workspaces)) {
      console.error('Invalid workspaces data', workspaces);
      workspaces = []; // Default to an empty array if invalid data is provided
    }
  
    // Now you can safely access the length
    console.log('Workspaces initialized', workspaces);
    setWorkspaces(workspaces); // assuming you have a state setter like setWorkspaces
  };

  return (
    <WorkspaceContext.Provider value={{
      workspaces,
      setWorkspaces,
      selectedWorkspace,
      setSelectedWorkspace,
      initializeWorkspaces,
      loading,
      user
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
