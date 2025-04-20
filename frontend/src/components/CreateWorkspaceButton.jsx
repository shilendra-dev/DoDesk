import {React, useState} from 'react'
import CreateWorkspace from './CreateWorkspace';
function CreateWorkspaceButton() {
    const [createTaskVisible, setCreateTaskVisible] = useState(false);

    const toggleCreateTaskVisiblity = () => {
    setCreateTaskVisible((prevState) => !prevState);
  };

    return (
        <div className="relative mt-4"> {/* This makes positioning relative to this div */}
            
                <button 
                onClick={toggleCreateTaskVisiblity} 
                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                    Create Task
                </button>
                
                {createTaskVisible && (
                    <div className="absolute bottom-full mb-2 z-50">
                    <CreateWorkspace />
                  </div>
                )}       
            
            
        </div>
    )
}

export default CreateWorkspaceButton