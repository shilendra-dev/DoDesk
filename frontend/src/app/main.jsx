import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router} from 'react-router-dom'
import { AuthProvider } from '../providers/AuthContext.jsx'
import { WorkspaceProvider } from '../providers/WorkspaceContext.jsx'
import { WorkspaceMembersProvider } from "../providers/WorkspaceMembers.jsx";
import { SavedFilterProvider } from '../providers/SavedFilterContext';
import { ThemeProvider } from '../providers/ThemeContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <WorkspaceProvider>
          <WorkspaceMembersProvider>
            <SavedFilterProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </SavedFilterProvider>
          </WorkspaceMembersProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);
