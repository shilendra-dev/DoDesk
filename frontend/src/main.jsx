import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { WorkspaceProvider } from './context/WorkspaceContext.jsx'
import { WorkspaceMembersProvider } from "./context/WorkspaceMembers";
import { SavedFilterProvider } from './context/SavedFilterContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <WorkspaceProvider>
          <WorkspaceMembersProvider>
            <SavedFilterProvider>
              <App />
            </SavedFilterProvider>
          </WorkspaceMembersProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);
