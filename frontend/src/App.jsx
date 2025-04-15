import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import AdminCreateUser from './components/AdminCreateUser';
import LandingPage from './pages/LandingPage';
import { Navigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:5033';
axios.defaults.withCredentials = true;

function App() {

  return (
    <>
      <Routes>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/" element={<LandingPage/>} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard/></ProtectedRoute>} />
          <Route path="/member" element={<ProtectedRoute allowedRoles={["member"]}><MemberDashboard/></ProtectedRoute>} />
          <Route path="/unauthorized" element={<h1>Your dumb ass is not authorized to view this page</h1>} />
          
      </Routes>
      
    </>
  )
}

export default App
