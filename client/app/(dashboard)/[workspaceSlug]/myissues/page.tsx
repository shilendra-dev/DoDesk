'use client'

import React, { useEffect } from 'react'
import { useWorkspace } from '@/providers/WorkspaceContext'
import { useTaskStore } from '@/stores/taskStore'
import { useTaskUIStore } from '@/stores/taskUIStore'
import { TaskListView } from '@/components/features/tasks/TaskListView'
import { TaskBoardView } from '@/components/features/tasks/TaskBoardView'
import { TaskDetails } from '@/components/features/tasks/TaskDetails'
import { CreateTaskButton } from '@/components/features/tasks/CreateTaskButton'
import { ViewToggle } from '@/components/features/tasks/ViewToggle'
import { LoadingSpinner } from '@/components/ui/atoms/loading-spinner'

export default function MyIssuesPage() {
  const { currentWorkspace, isLoading: workspaceLoading } = useWorkspace()
  const { tasks, loadingStates, selectedTaskId, fetchTasks, setSelectedTask } = useTaskStore()
  const { view, showCreateTask, setShowCreateTask } = useTaskUIStore()

  // Fetch tasks when workspace changes
  useEffect(() => {
    if (currentWorkspace?.id) {
      fetchTasks(currentWorkspace.id)
    }
  }, [currentWorkspace?.id, fetchTasks])

  if (workspaceLoading || loadingStates.fetchTasks) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Issues</h1>
          <p className="text-sm text-muted-foreground">
            {currentWorkspace?.name && `in ${currentWorkspace.name}`}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <ViewToggle />
          <CreateTaskButton 
            workspaceId={currentWorkspace?.id}
            showCreateTask={showCreateTask}
            setShowCreateTask={setShowCreateTask}
          />
        </div>
      </div>

      {/* Main Content */}
      
        <div className="flex-1">
          {view === 'list' ? (
            <TaskListView tasks={Object.values(tasks)} isLoading={loadingStates.fetchTasks} />
          ) : (
            <TaskBoardView tasks={Object.values(tasks)} />
          )}
        </div>

        {/* Task Details Sidebar */}
        {selectedTaskId && (
            <TaskDetails 
              key={`task-details-${selectedTaskId}`}
              taskId={selectedTaskId} 
              onClose={() => setSelectedTask(null)} 
            />
        )}
      
    </div>
  )
}