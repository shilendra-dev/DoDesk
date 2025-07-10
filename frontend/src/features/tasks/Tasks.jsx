import { useEffect, useState, useCallback } from "react";
import TaskDetails from "./TaskDetails";
import axios from "axios";
import {useWorkspace} from "../../providers/WorkspaceContext"
import toast from "react-hot-toast";
import LoadingSpinner from "../../shared/components/atoms/LoadingSpinner";
import TopBar from "./components/TopBar";
import TaskContainer from "./components/TaskContainer";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5033";

function Tasks() {
  const [view, setView] = useState("list"); // 'board' or 'list'
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const { selectedWorkspace } = useWorkspace();
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [showCreateTask, setShowCreateTask] = useState(false);
  const workspaceId = selectedWorkspace?.id;

  const fetchTasks = useCallback(async () => {
    if (!workspaceId) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE_URL}/api/workspace/${workspaceId}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  //Intial fetch of tasks
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  //handle task creation
  const handleTaskCreated = useCallback((newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    toast.success("Task created successfully!");
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-[var(--color-bg)] dark:bg-[var(--color-bg)] border-[var(--color-border)] dark:border-[var(--color-border)] border-[0.5px]">
        <div className="flex justify-center items-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full max-w-lvw bg-[var(--color-bg)] dark:bg-[var(--color-bg)] border-[var(--color-border)] dark:border-[var(--color-border)] overflow-hidden">
      <TopBar
        onToggle={setView}
        onCreateClick={() => setShowCreateTask(true)}
        showCreateTask={showCreateTask}
        setShowCreateTask={setShowCreateTask}
        onTaskCreated={handleTaskCreated}
        workspaceId={workspaceId}
      />
    
      <div className="flex flex-1 h-full overflow-hidden flex-col">
        {/* Scrollable tasks area */}
        <TaskContainer
          view={view}
          tasks={tasks}
          setTasks={setTasks}
          onTaskSelect={setSelectedTask}
          refreshTasks={fetchTasks}
        />
      </div>

      {selectedTask && (
        <div className="w-fit border-l border-[var(--color-border)] dark:border-[var(--color-border)] overflow-y-auto">
          <TaskDetails 
            task={selectedTask} 
            onClose={() => setSelectedTask(null)} 
          />
        </div>
      )}
    </div>
  );
}

export default Tasks;