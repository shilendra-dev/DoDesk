import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Popup from 'reactjs-popup'
import CreateTask from '../components/CreateTask'
import CreateWorkspace from '../components/CreateWorkspace';



function Dashboard() {
  const [createTaskVisible, setCreateTaskVisible] = useState(false);

  const toggleCreateTaskVisiblity = () => {
    setCreateTaskVisible((prevState) => !prevState);
  };

  return (
    <>
      <div className='flex'>
      <Sidebar/>
        <div>
          <button onClick={toggleCreateTaskVisiblity} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Create Task</button>
          {createTaskVisible && <CreateWorkspace/>}       
            
        </div>
        
      </div>
      
      
    </>
  )
}

export default Dashboard