import axios from 'axios';
import {React, useState} from 'react'
import { useNavigate } from 'react-router-dom'

function CreateWorkspace({onClose}) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    
    const handleChange = async(e) => {
        setName(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
    
        try{
            const token = localStorage.getItem("token");
            const res = await axios.post("http://localhost:5033/api/workspaces/create-workspace", {name} ,
                {headers:{
                    Authorization: `Bearer ${token}`
                }}
            );

            const {workspace: newWorkspace} = res.data;

            setMessage('Workspace susccessfully created');
            const existing = JSON.parse(localStorage.getItem("workspaces")) || [];
            const updated = [...existing, newWorkspace];
            localStorage.setItem("workspaces", JSON.stringify(updated));

            // 🔔 Also trigger update to notify dropdown
            window.dispatchEvent(new Event("workspace-updated"));

            setName('')
            
            navigate(`/${newWorkspace.id}`);
            window.location.reload();
        }catch(err){
            console.error(err);
            setMessage(err.response?.data?.message || 'error creating workspace');
        }
    };

    return (
    <>
        {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}

        
        <div className="rounded-2xl flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg dark:bg-gray-800">

            <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
            ✕
            </button>
            
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <h1 className="font-sans text-2xl font-extrabold align">Create Workspace</h1>
                <div>
                <label htmlFor="name" className="block mb-1 text-[15px] font-medium text-gray-700 dark:text-gray-300">Workspace name:</label>
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    placeholder="The Next Big Thing"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                </div>

                <button
                type="submit"
                className="w-full bg-blue-600 text-white text-[12px] font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                Create
                </button>
            </form>
            </div>
        </div>

    </>
  )
}

export default CreateWorkspace