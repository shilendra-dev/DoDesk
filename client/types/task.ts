export interface Task {
    id: string
    title: string
    description?: string
    status: 'pending' | 'in-progress' | 'completed'
    priority: 'high' | 'mid' | 'low'
    due_date?: string
    workspace_id: string
    created_by: string
    created_by_name?: string
    created_at: string
    updated_at: string
    notes?: string
    assignees: Assignee[]
  }
  
  export interface Assignee {
    id: string
    name: string
  }
  
  export interface CreateTaskData {
    title: string
    description?: string
    status?: 'pending' | 'in-progress' | 'completed'
    priority?: 'high' | 'mid' | 'low'
    due_date?: string
    workspace_id: string
  }
  
  export interface UpdateTaskData {
    title?: string
    description?: string
    status?: 'pending' | 'in-progress' | 'completed'
    priority?: 'high' | 'mid' | 'low'
    due_date?: string
    assignees?: Assignee[]
    assignee_ids?: string[]
  }
  export interface TaskFilter {
    statusFilter: string
    priorityFilter: string
    assigneeFilter: string
    sortOption: string
}
  
  export type TaskView = 'list' | 'board'