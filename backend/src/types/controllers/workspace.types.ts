import type { Workspace, Team, TeamMember } from '../../generated/prisma';

export interface CreateWorkspaceRequest {
  name: string;
  slug: string;
}

export interface CreateWorkspaceResponse {
  workspace: Workspace & {
    teams: (Team & {
      members: TeamMember[];
    })[];
  };
}

export interface GetUserWorkspacesResponse {
  workspaces: (Workspace & {
    teams: (Team & {
      members: (TeamMember & {
        user: {
          id: string;
          name: string | null;
          email: string;
        };
      })[];
    })[];
  })[];
}

export interface InviteMemberRequest {
  email: string;
}

export interface InviteMemberResponse {
  workspace_name: string;
  user_name: string | null;
}

export interface GetWorkspaceMembersResponse {
  members: Array<{
    id: string;
    user_id: string;
    name: string | null;
    email: string;
  }>;
}

export interface SetLastActiveWorkspaceRequest {
  workspace_id: string;
}

export interface GetWorkspaceDetailsResponse {
  workspace: {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    created_by: string;
    role: string;
  };
}

export interface CheckSlugAvailabilityResponse {
  available: boolean;
  slug: string;
}