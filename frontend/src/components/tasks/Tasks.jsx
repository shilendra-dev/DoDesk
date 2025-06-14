import { useEffect, useState } from "react";
import ViewToggle from "./ViewToggle";
import TaskBoardView from "./TaskBoardView";
import TaskListView from "./TaskListView";
import TaskDetails from "./TaskDetails";
import CreateTaskButton from "./CreateTaskButton";
import axios from "axios";
import {useWorkspace} from "../../context/WorkspaceContext"
import CreateTask from "./CreateTask";

function Tasks() {
  const [view, setView] = useState("list"); // 'board' or 'list'
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const { selectedWorkspace } = useWorkspace();
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [showCreateTask, setShowCreateTask] = useState(false);
  const workspaceId = selectedWorkspace?.id;

  useEffect(() => {
    // Fetching tasks from backend
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5033/api/tasks/${workspaceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched tasks:", res.data);

        setTasks(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };
    fetchTasks();
  }, [workspaceId]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-[#101221] rounded-xl border-gray-800 border-[0.5px] p-4">
        <div className="flex justify-center items-center h-full">
          <p className="text-white text-xl">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full max-w-lvw bg-[#101221] rounded-xl border-gray-800 border-[0.5px] overflow-hidden">
      {/* Top bar */}
      <div className="flex justify-between items-center p-4 border-b-[0.5px] border-b-gray-800">
        <h1 className="text-xl font-semibold">Tasks</h1>
        <div className="flex items-center gap-4">
          <ViewToggle onToggle={(mode) => setView(mode)} />
          <CreateTaskButton onClick={() => setShowCreateTask(true)} />
          <CreateTask
            isOpen={showCreateTask}
            onClose={() => setShowCreateTask(false)}
            onTaskCreated={(newTask) => setTasks([newTask, ...tasks])}
            workspaceId={workspaceId}
          />
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex flex-1 h-full overflow-hidden flex-col">
        {/* Scrollable tasks area */}
        <div className="flex flex-col flex-1 h-0 overflow-y-auto">
          {view === "board" ? (
            <TaskBoardView 
              tasks={tasks} 
              setTasks={setTasks} 
              onTaskSelect={setSelectedTask} 
            />
          ) : (
            <TaskListView setTasks={setTasks} tasks={tasks} />
          )}
        </div>

        {/* Pagination controls */}
        <div className="flex justify-center mt-4">
          {/* Add your pagination controls here */}
        </div>
      </div>

      {/* Task Details */}
      {selectedTask && (
        <div className="w-[400px] border-l border-gray-200 overflow-y-auto">
          <TaskDetails task={selectedTask} onClose={() => setSelectedTask(null)} />
        </div>
      )}
    </div>
  );
}

export default Tasks;