import TaskBoardView from "../TaskBoardView";
import TaskListView from "../TaskListView";

function TaskContainer({ view, tasks, setTasks, onTaskSelect, refreshTasks }) {
  return (
    <div className="flex flex-col flex-1 h-0 overflow-y-auto">
      {view === "board" ? (
        <TaskBoardView tasks={tasks} setTasks={setTasks} onTaskSelect={onTaskSelect} />
      ) : (
        <TaskListView tasks={tasks} setTasks={setTasks} refreshTasks={refreshTasks} />
      )}
    </div>
  );
}

export default TaskContainer;