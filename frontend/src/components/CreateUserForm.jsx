import axios from 'axios';
import React from 'react'
import { useState } from 'react'

function CreateUserForm() {

    const[formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'member'
    })

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5033/api/admin/create-user', formData, {
                headers: {
                    Authorization: token,
                },
            });
            alert('User Created Successfully');
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'member',
            });
        }catch(err){
            console.error('Error creating new user: ', err);
            alert('Failed to create user')
        }
    };
  return (
    <div>
        <div className="flex justify-center min-h-screen items-center">
            <div className="max-w-sm p-6 content-right bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 w-full h-135">
                <h2 className="font-extrabold text-4xl mb-2 mt-2">Create User</h2>
                <div className="flex w-full pt-5">
                    <form onSubmit={handleSubmit} className=" w-full">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-100">Full Name:</label>
                        <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formData.name} placeholder='John Doe' id='name' onChange={(e)=> setFormData({...formData, name: e.target.value})}></input><br/>

                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-100">Email Address:</label>
                        <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formData.email} placeholder='johndoe@email.com' id='email' onChange={(e)=> setFormData({...formData, email: e.target.value})}></input><br/>
                        
                        <label htmlFor="roles" className="block mb-2 text-sm font-medium text-gray-100">Select Role:</label>
                        <select id="roles" className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-300 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formData.role} onChange={(e)=> setFormData({...formData, role: e.target.value})}>
                            <option value="" selected disabled >Choose Role</option>
                            <option value="admin">Admin</option>
                            <option value="member">Member</option>
                        </select>

                        <label htmlFor="password" className="block mb-2 mt-6 text-sm font-medium text-gray-100">Password:</label>
                        <input type="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formData.password} placeholder='********' id='password' onChange={(e)=> setFormData({...formData, password: e.target.value})}></input><br/>
                        
                        <input type='submit' value='Create User' className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-"/>
                        
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreateUserForm