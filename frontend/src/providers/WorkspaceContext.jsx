import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const token = localStorage.getItem('token');

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [defaultWorkspaceId, setDefaultWorkspaceId] = useState(null);
  const [defaultWorkspace, setDefaultWorkspace] = useState(null);

  // Fetch user and workspaces on page reload
  useEffect(() => {
    const fetchUserData = async () => {
      try {

        const userRes = await axios.get('http://localhost:5033/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userRes.data.user);
        
        const res = await axios.get(`http://localhost:5033/api/user/${userRes.data.user.id}/workspaces`,  {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        });

        setWorkspaces(res.data.workspaces || []);

        // Set defaultWorkspaceId from user object
        setDefaultWorkspaceId(userRes.data.user?.default_workspace_id);

        // Find and set the default workspace object
        let defaultWorkspace = null;
        if (userRes.data.user?.default_workspace_id && res.data.workspaces) {
          defaultWorkspace = res.data.workspaces.find(
            ws => ws.id === userRes.data.user.default_workspace_id
          );
        }
        if (!defaultWorkspace && res.data.workspaces && res.data.workspaces.length > 0) {
          defaultWorkspace = res.data.workspaces[0];
        }
        setDefaultWorkspace(defaultWorkspace);
        setSelectedWorkspace(defaultWorkspace);
        

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
    setWorkspaces(workspaces); 
    // Now you can safely access the length

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
      user,
      defaultWorkspaceId,
      setDefaultWorkspaceId,
      defaultWorkspace,
      setDefaultWorkspace,
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
