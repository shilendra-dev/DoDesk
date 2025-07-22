export interface IssueFilterConfig {
  stateFilter?: string
  priorityFilter?: string
  sortOption?: string
  assigneeFilter?: string
  // Add more fields as needed for advanced filtering
}

export interface SavedFilter {
  id: string
  name: string
  filter_config: IssueFilterConfig
  is_default: boolean
  user_id: string
  workspace_id: string
  created_at: string
  updated_at: string
}

export interface CreateFilterData {
  name: string
  filter_config: IssueFilterConfig
}