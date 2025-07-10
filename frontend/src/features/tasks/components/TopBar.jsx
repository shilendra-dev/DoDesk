import React from 'react'
import CreateTask from "./CreateTask";
import CreateTaskButton from "../../../shared/components/molecules/CreateTaskButton";
import ViewToggle from "../../../shared/components/molecules/ViewToggle";


function TopBar({onToggle, onCreateClick, showCreateTask, setShowCreateTask, workspaceId, onTaskCreated}) {
  return (
    <div className="flex justify-between items-center pl-4 pr-4 pt-2 pb-2 border-b-[0.5px] border-b-gray-800">
      <h1 className="text-xl font-semibold">Tasks</h1>
      <div className="flex items-center gap-4">
        <ViewToggle onToggle={onToggle} />
        <CreateTaskButton onClick={onCreateClick} />
        <CreateTask
          isOpen={showCreateTask}
          onClose={() => setShowCreateTask(false)}
          onTaskCreated={onTaskCreated}
          workspaceId={workspaceId}
        />
      </div>
    </div>    
  )
}

export default TopBar