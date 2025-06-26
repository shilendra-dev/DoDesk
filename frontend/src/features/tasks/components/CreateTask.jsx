import React, { useState } from 'react';
import { X, Text, AlignLeft, Flag, CheckSquare, Calendar, PlusCircle } from 'lucide-react';
import axios from 'axios';
import TextArea from '../../../shared/components/atoms/TextArea';
import Select from '../../../shared/components/atoms/Select';
import Input from '../../../shared/components/atoms/Input';

function CreateTask({ isOpen, onClose, onTaskCreated, workspaceId }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        priority: 'mid',
        due_date: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const res = await axios.post(`http://localhost:5033/api/workspaces/${workspaceId}/task`, {
                ...formData,
                workspace_id: workspaceId,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onTaskCreated(res.data.task);
            onClose();
        } catch (error) {
            console.error("Error creating task: ", error);
        }
    };

    return (
        <div className={`fixed top-0 right-0 w-[480px] max-w-full h-full bg-[#0f172a] z-70 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} task-details-enter`}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#0f172a]/95 backdrop-blur-sm sticky top-0 z-10">
                <h2 className="text-xl font-semibold text-white truncate flex items-center gap-2">
                    <PlusCircle size={20} className="text-blue-400" />
                    Create Task
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-all duration-150 transform hover:scale-110 hover:rotate-90 flex items-center"
                    aria-label="Close drawer"
                >
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 pt-3 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-400 w-[140px] flex-shrink-0">
                        <Text size={16} />
                        <label htmlFor="title" className="uppercase tracking-wide font-semibold text-xs select-none">
                            Title
                        </label>
                    </div>
                    <Input
                        id="title"
                        type="text"
                        name="title"
                        placeholder="Enter task title"
                        required
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-400 w-[140px] flex-shrink-0">
                            <CheckSquare size={16} />
                            <label htmlFor="status" className="uppercase tracking-wide font-semibold text-xs select-none">
                                Status
                            </label>
                        </div>
                        <Select
                            id="status"
                            name="status"
                            defaultValue="pending"
                            onChange={handleChange}
                        >
                            <option value="pending" className="bg-[#1e293b]">Pending</option>
                            <option value="in-progress" className="bg-[#1e293b]">In Progress</option>
                            <option value="completed" className="bg-[#1e293b]">Completed</option>
                        </Select>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-400 w-[140px] flex-shrink-0">
                            <Flag size={16} />
                            <label htmlFor="priority" className="uppercase tracking-wide font-semibold text-xs select-none">
                                Priority
                            </label>
                        </div>
                        <Select
                            id="priority"
                            name="priority"
                            defaultValue="mid"
                            onChange={handleChange}
                        >
                            <option value="low" className="bg-[#1e293b]">Low</option>
                            <option value="mid" className="bg-[#1e293b]">Mid</option>
                            <option value="high" className="bg-[#1e293b]">High</option>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-400 w-[140px] flex-shrink-0">
                        <Calendar size={16} />
                        <label htmlFor="due_date" className="uppercase tracking-wide font-semibold text-xs select-none">
                            Due Date
                        </label>
                    </div>
                    <Input
                        id="due_date"
                        type="date"
                        name="due_date"
                        onChange={handleChange}
                    />
                </div>

                <div className="flex items-start gap-4">
                    <div className="flex items-center gap-2 text-gray-400 w-[140px] flex-shrink-0 mt-1">
                        <AlignLeft size={16} />
                        <label htmlFor="description" className="uppercase tracking-wide font-semibold text-xs select-none">
                            Description
                        </label>
                    </div>
                    
                    <TextArea 
                        id = "description"
                        name = "description"
                        placeholder = "Add task description..."
                        rows = {4}
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium
                            transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-lg
                            flex items-center justify-center gap-2 text-base"
                    >
                        <PlusCircle size={18} />
                        Create Task
                    </button>
                </div>
            </form>

            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                .task-details-enter {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

export default CreateTask;
