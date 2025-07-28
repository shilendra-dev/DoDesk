export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
    lastActiveWorkspaceId: string | null;
  };
  workspaces?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  error?: string;
}

export interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}