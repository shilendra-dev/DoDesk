import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { WorkspaceProvider } from './context/WorkspaceContext.jsx'
import { WorkspaceMembersProvider } from "./context/WorkspaceMembers";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <WorkspaceProvider>
          <WorkspaceMembersProvider>
            <App />
          </WorkspaceMembersProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);
