export interface Issue {
    id: string
    title: string
    description?: string
    state: string // "backlog" | "todo" | "in_progress" | "done" | "canceled"
    priority: number // p0=no priority, p1=urgent, p2=high, p3=medium, p4=low 
    labels: string[]
    dueDate?: string
    notes?: string
    number: number // Linear-style issue number (unique per team)
    workspaceId: string
    teamId: string
    assigneeId?: string 
    creatorId?: string
    createdAt: string
    updatedAt: string
    issueKey: string // e.g., "ENG-1"
    creator?: {
      id: string
      name?: string
      email?: string
    }
    assignee?: {
      id: string
      name?: string
      email?: string
    }
    team?: {
      key: string
      name: string
      color?: string
    }
    commentCount?: number
  }
  
  // For creating a new issue
  export interface CreateIssueData {
    title: string
    description?: string
    state?: string
    priority?: number
    labels?: string[]
    dueDate?: string
    notes?: string
    teamId: string
    assigneeId?: string | null
    workspaceId: string
  }
  
  // For updating an issue
  export interface UpdateIssueData {
    title?: string
    description?: string
    state?: string
    priority?: number
    labels?: string[]
    dueDate?: string
    notes?: string
    assigneeId?: string
  }