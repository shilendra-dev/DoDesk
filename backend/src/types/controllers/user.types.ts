import type { User, Workspace } from '@prisma/client';

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface CreateUserResponse {
  user: Omit<User, 'password'>;
}

export interface GetCurrentUserResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    lastActiveWorkspaceId: string | null;
    lastActiveWorkspace?: Workspace | null;
  };
}