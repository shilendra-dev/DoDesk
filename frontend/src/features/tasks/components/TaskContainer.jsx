import TaskBoardView from "../TaskBoardView";
import TaskListView from "../TaskListView";

function TaskContainer({ view, onTaskSelect, refreshTasks }) {
  return (
    <div className="flex flex-col flex-1 h-0 overflow-y-auto">
      {view === "board" ? (
        <TaskBoardView onTaskSelect={onTaskSelect} />
      ) : (
        <TaskListView refreshTasks={refreshTasks} />
      )}
    </div>
  );
}

export default TaskContainer;