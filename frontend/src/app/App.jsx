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
import Overview from '../features/dashboard/Overview'
import Tasks from '../features/tasks/Tasks'
import Team from '../features/dashboard/Team'
import { Toaster } from "react-hot-toast";


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
          <Route path="/unauthorized" element={<h1>Your dumb ass is not authorized to view this page</h1>} />
          
          
          <Route path="/" element={<Dashboard />}>
            <Route path="createworkspace" element={<CreateWorkspace />} />
            <Route path=":workspaceId" element={null} /> {/* Dashboard handles this */}
          </Route>

          <Route path=":workspaceId" element={<Dashboard/>}>
            <Route path="overview" element={<Overview/>}/>
            <Route path="tasks" element={<Tasks/>}/>
            <Route path="team" element={<Team/>}/>
            <Route path="analytics" element={<Team/>}/>
            <Route path="calender" element={<Team/>}/>
          </Route>
      </Routes>
    </>
  )
}

export default App
