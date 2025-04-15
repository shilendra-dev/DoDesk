import React from 'react'
import { useState } from 'react'
import AdminCreateUser from '../components/AdminCreateUser'
import CreateTask from '../components/CreateTask'

function AdminDashboard() {
  return (
    <>
        <h1 className='text-black'>Welcome to Admin Dashboard</h1>
        <input type='submit' value='Login' className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-"/>
        <CreateTask/>
    </>
  )
}

export default AdminDashboard