import type { Issue } from '../../generated/prisma';

export interface CreateIssueRequest {
  title: string;
  description?: string;
  state?: string;
  priority?: number;
  labels?: string[];
  dueDate?: string;
  teamId: string;
  assigneeId?: string;
}

export interface CreateIssueResponse {
  issue: Issue & {
    creator: {
      id: string;
      name: string | null;
      email: string;
    };
    assignee?: {
      id: string;
      name: string | null;
      email: string;
    };
    team: {
      key: string;
      name: string;
    };
    issueKey: string;
  };
}

export interface GetIssuesQuery {
  state?: string;
  assignee?: string;
  priority?: string;
  search?: string;
}

export interface GetIssuesResponse {
  issues: Array<Issue & {
    creator: {
      id: string;
      name: string | null;
      email: string;
    };
    assignee?: {
      id: string;
      name: string | null;
      email: string;
    };
    team: {
      key: string;
      name: string;
      color: string;
    };
    issueKey: string;
    commentCount: number;
  }>;
}

export interface UpdateIssueRequest {
  title?: string;
  description?: string;
  state?: string;
  priority?: number;
  labels?: string[];
  dueDate?: string;
  assigneeId?: string;
  notes?: string;
}

export interface UpdateIssueResponse {
  issue: Issue & {
    creator: {
      name: string | null;
    };
    assignee?: {
      name: string | null;
    };
    team: {
      key: string;
      name: string;
    };
    issueKey: string;
  };
}

export interface DeleteIssueResponse {
  issue: Issue & {
    team: {
      key: string;
    };
    issueKey: string;
  };
}