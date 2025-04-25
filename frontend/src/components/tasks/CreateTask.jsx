import React, { useState } from 'react'
import { HandCoins, X } from 'lucide-react';
import axios from 'axios';

function CreateTask({isOpen, onClose, onTaskCreated, workspaceId}) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        priority: 'mid',
        due_date: ''
    });
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try{
            const res = await axios.post("http://localhost:5033/api/tasks/", {
                ...formData,
                workspace_id: workspaceId,
                }, {
                headers: { Authorization: `Bearer ${token}`}
            });
            onTaskCreated(res.data);
            onClose();
        }catch(error){
            console.error("Error creating task: ",error);
        }
    }
    
    return (
        <div className={`fixed top-0 right-0 w-[300px] h-full bg-[#090F13] border-l border-gray-800 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>

            <div className='flex justify-between items-center p-4 border-b border-gray-700'>
                <h2 className='text-lg font-(family-name:Roboto) font-semibold'>Add Task</h2>
                <button onClick={onClose}><X className='text-gray-400 hover:text-white'/></button>
            </div>

            <form onSubmit={handleSubmit} className='p-4 flex flex-col gap-4'>
                <input type='text' name='title' placeholder='Task name' required className='bg-[#181a2b] p-2 rounded-xl text-white' onChange={handleChange}/>
                <textarea name='description' placeholder='Description' className='bg-[#181a2b] p-2 rounded-xl text-white' onChange={handleChange}/>
                <select name="status" className='bg-[#181a2b] p-2 rounded-xl text-white' onChange={handleChange}>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="high">Completed</option>
                </select>
                <select name="priority" className=' bg-[#181a2b] p-2 rounded-xl text-white' onChange={handleChange}>
                    <option value="low">Low</option>
                    <option value="mid" selected>Mid</option>
                    <option value="high">High</option>
                </select>
                <input type="date" name='due_date' className='bg-[#181a2b]  p-2 rounded-xl text-white' onChange={handleChange} />
                <button type='submit' className='bg-green-600 hover:bg-green-700 text-white p-2 rounded-xl'>Create Task</button>
            </form>
            
        </div>
    )
}

export default CreateTask
