import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

function CreateTask({ isOpen, onClose, onTaskCreated, workspaceId }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        priority: 'mid',
        due_date: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const res = await axios.post("http://localhost:5033/api/tasks/", {
                ...formData,
                workspace_id: workspaceId,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onTaskCreated(res.data);
            onClose();
        } catch (error) {
            console.error("Error creating task: ", error);
        }
    };

    return (
        <div className={`fixed top-0 right-0 w-[360px] max-w-full h-full bg-[#101221] border-l border-gray-800 shadow-xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
            <div className="flex justify-between items-center p-5 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Create Task</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                    <X />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 text-white">
                <input
                    type="text"
                    name="title"
                    placeholder="Task title"
                    required
                    className="bg-[#1a1f2e] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                    onChange={handleChange}
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    rows="4"
                    className="bg-[#1a1f2e] p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                    onChange={handleChange}
                />
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="text-sm text-gray-400 block mb-1">Status</label>
                        <select
                            name="status"
                            defaultValue="pending"
                            className="bg-[#1a1f2e] p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                            onChange={handleChange}
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="text-sm text-gray-400 block mb-1">Priority</label>
                        <select
                            name="priority"
                            defaultValue="mid"
                            className="bg-[#1a1f2e] p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                            onChange={handleChange}
                        >
                            <option value="low">Low</option>
                            <option value="mid">Mid</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="text-sm text-gray-400 block mb-1">Due Date</label>
                    <input
                        type="date"
                        name="due_date"
                        className="bg-[#1a1f2e] p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    className="mt-2 bg-green-600 hover:bg-green-700 transition-colors p-3 rounded-lg font-medium"
                >
                    Create Task
                </button>
            </form>
        </div>
    );
}

export default CreateTask;
