import React from 'react'
import CreateUserForm from './CreateUserForm'

function AdminCreateUser() {

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Create a New User</h2>
            <CreateUserForm/>
        </div>
    )
}

export default AdminCreateUser