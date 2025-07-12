// frontend/src/app/App.jsx
import './App.css'
import Login from '../features/auth/Login';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Dashboard from '../features/dashboard/Dashboard';
import PrivateRoute from '../features/auth/PrivateRoute';
import ProtectedRoute from '../features/auth/ProtectedRoute';
import LandingPage from '../pages/LandingPage';
import { Navigate } from 'react-router-dom';
import CreateWorkspace from '../features/workspace/CreateWorkspace';
import { Toaster } from "react-hot-toast";

// Import Linear-inspired page components
import Overview from '../features/dashboard/Overview'
import Tasks from '../features/tasks/Tasks'
import Team from '../features/dashboard/Team'
import Inbox from '../features/inbox/Inbox'           // New
import Projects from '../features/projects/Projects' // New
import Views from '../features/views/Views'           // New
import MoreOptions from '../features/MoreOprions/MoreOptions'               // New
// import Analytics from '../features/analytics/Analytics' // New
// import Import from '../features/import/Import'         // New
// import Invite from '../features/invite/Invite'         // New

axios.defaults.baseURL = 'http://localhost:5033';
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
        <Route path="/" element={<LandingPage/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/unauthorized" element={<h1>Unauthorized access</h1>} />
        
        <Route path="/" element={<Dashboard />}>
          <Route path="createworkspace" element={<CreateWorkspace />} />
          <Route path=":workspaceId" element={null} />
        </Route>

        {/* Linear-inspired routes */}
        <Route path=":workspaceId" element={<Dashboard/>}>
          {/* Personal Section */}
          <Route path="inbox" element={<Inbox/>}/>
          <Route path="tasks" element={<Tasks/>}/>
          
          {/* Workspace Section */}
          <Route path="overview" element={<Overview/>}/>
          <Route path="projects" element={<Projects/>}/>
          <Route path="views" element={<Views/>}/>
          <Route path="more" element={<MoreOptions/>}/>
          
          {/* Analytics & Team */}
          {/* <Route path="analytics" element={<Analytics/>}/> */}
          <Route path="team" element={<Team/>}/>
          <Route path="calender" element={<Team/>}/>
          
          {/* Team-specific routes */}
          <Route path="team/:teamId/issues" element={<Tasks/>}/>
          <Route path="team/:teamId/projects" element={<Projects/>}/>
          <Route path="team/:teamId/views" element={<Views/>}/>
          
          {/* Utility routes */}
          {/* <Route path="import" element={<Import/>}/>
          <Route path="invite" element={<Invite/>}/> */}
        </Route>
      </Routes>
    </>
  )
}

export default App