import { Request, Response } from 'express';
import type { User } from '../../generated/prisma';

// Base API Response Types
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data?: T;
  error?: string;
  type?: 'success' | 'error';
}

export interface AuthenticatedRequest extends Request {
  user: User;
}

export type ControllerFunction<T = any> = (
  req: AuthenticatedRequest | Request,
  res: Response
) => Promise<ApiResponse<T>>;

// Route Parameters Types
export interface WorkspaceParams {
  workspace_id: string;
}

export interface TeamParams {
  team_id: string;
}

export interface IssueParams {
  issueId: string;
}

export interface CommentParams {
  id: string;
}

export interface FilterParams {
  filterId: string;
}

export interface SlugParams {
  slug: string;
}

// Extended Request Types
export type WorkspaceRequest = AuthenticatedRequest & {
  params: WorkspaceParams;
};

export type TeamRequest = AuthenticatedRequest & {
  params: TeamParams;
};

export type IssueRequest = AuthenticatedRequest & {
  params: IssueParams;
};

export type CommentRequest = AuthenticatedRequest & {
  params: CommentParams;
};

export type FilterRequest = AuthenticatedRequest & {
  params: FilterParams;
};

export type SlugRequest = AuthenticatedRequest & {
  params: SlugParams;
};