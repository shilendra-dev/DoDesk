import React from 'react'
import { useState } from 'react'
import AdminCreateUser from '../components/AdminCreateUser'

function AdminDashboard() {
  return (
    <>
        <h1>Welcome to Admin Dashboard</h1>
        <AdminCreateUser />
    </>
  )
}

export default AdminDashboard