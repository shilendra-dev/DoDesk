export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: {
      id: string;
      email: string;
      name: string | null;
      lastActiveWorkspaceId: string | null;
    };
    workspaces: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  }