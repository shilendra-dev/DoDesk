import { useEffect, useState } from "react";
import ViewToggle from "../../shared/components/molecules/ViewToggle";
import TaskBoardView from "./TaskBoardView";
import TaskListView from "./TaskListView";
import TaskDetails from "./TaskDetails";
import CreateTaskButton from "../../shared/components/molecules/CreateTaskButton";
import axios from "axios";
import {useWorkspace} from "../../providers/WorkspaceContext"
import CreateTask from "./components/CreateTask";
import toast from "react-hot-toast";

function Tasks() {
  const [view, setView] = useState("list"); // 'board' or 'list'
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const { selectedWorkspace } = useWorkspace();
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [showCreateTask, setShowCreateTask] = useState(false);
  const workspaceId = selectedWorkspace?.id;

  // Define refreshTasks function
  const refreshTasks = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5033/api/workspace/${workspaceId}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(res.data.tasks || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching tasks: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!workspaceId) return;
    // Fetching tasks from backend
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        const res = await axios.get(
          `http://localhost:5033/api/workspace/${workspaceId}/tasks`, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTasks(res.data.tasks || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };
    fetchTasks();
  }, [workspaceId]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-[var(--color-bg)] dark:bg-[var(--color-bg)] border-[var(--color-border)] dark:border-[var(--color-border)] border-[0.5px]">
        <div className="flex justify-center items-center h-full">
          <p className="text-[var(--color-text)] dark:text-[var(--color-text)] text-xl">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full max-w-lvw bg-[var(--color-bg)] dark:bg-[var(--color-bg)] border-[var(--color-border)] dark:border-[var(--color-border)] overflow-hidden">
      {/* Top bar */}
      <div className="flex justify-between items-center p-4 border-b-[0.5px] border-b-gray-800">
        <h1 className="text-xl font-semibold">Tasks</h1>
        <div className="flex items-center gap-4">
          <ViewToggle onToggle={(mode) => setView(mode)} />
          <CreateTaskButton onClick={() => setShowCreateTask(true)} />
          
          <CreateTask
            isOpen={showCreateTask}
            onClose={() => setShowCreateTask(false)}
            onTaskCreated={(newTask) => {
              setTasks((prev) => [newTask, ...prev]); // Add new task to the top
              toast.success("Task created successfully!");
            }}
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
            <TaskListView setTasks={setTasks} tasks={tasks} refreshTasks={refreshTasks} />
          )}
        </div>

        {/* Pagination controls */}
        <div className="flex justify-center ">
          {/* Add your pagination controls here */}
        </div>
      </div>

      {/* Task Details */}
      {selectedTask && (
        <div className="w-fit border-l border-[var(--color-border)] dark:border-[var(--color-border)] overflow-y-auto">
          <TaskDetails task={selectedTask} onClose={() => setSelectedTask(null)} />
        </div>
      )}
    </div>
  );
}

export default Tasks;