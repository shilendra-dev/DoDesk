import React from 'react'

function CreateTask() {
    return (
        <>
            <h2>Create a task</h2>

            <div className="bg-gray-800">
            <form className=" w-full">
                <label htmlFor="taskName" className="block mb-2 text-sm font-medium text-gray-100">Task Name:</label>
                <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='johndoe@email.com' id='taskName' ></input><br/>
                        
                <label htmlFor="taskDes" className="block mb-2 text-sm font-medium text-gray-100">Task Description:</label>
                <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='********' id='taskDes'></input><br/>

                <label htmlFor="roles" className="block mb-2 text-sm font-medium text-gray-100">Select Members:</label>
                    <select id="roles" className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-300 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="" selected disabled >Choose Role</option>
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                    </select>

                <input type='submit' value='createTask' className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-"/>                        
            </form>
            </div>
        </>
    )
}

export default CreateTask
