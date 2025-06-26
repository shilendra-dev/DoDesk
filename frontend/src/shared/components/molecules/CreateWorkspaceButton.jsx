import {React, useState} from 'react'
import CreateWorkspace from '../../../features/workspace/CreateWorkspace';
function CreateWorkspaceButton() {
    const [createTaskVisible, setCreateTaskVisible] = useState(false);

    const toggleCreateTaskVisiblity = () => {
    setCreateTaskVisible((prevState) => !prevState);
  };
  

    return (
        <div className=" mt-4 w-64"> {/* This makes positioning relative to this div */}

                <button
                onClick={toggleCreateTaskVisiblity}
                className="focus:outline-none text-black max-w-fit w-full bg-[var(--color-bright)] hover:bg-[var(--color-button-hover)] font-medium rounded-lg text-sm px-5 py-2.5 "
                >
                    Create Workspace
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