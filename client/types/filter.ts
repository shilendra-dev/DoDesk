import { TaskFilter } from "./task";

export interface SavedFilter {
  id: string;
  name: string;
  filter_config: TaskFilter;
  is_default: boolean;
  user_id: string;
  workspace_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFilterData {
  name: string;
  filter_config: TaskFilter;
}
