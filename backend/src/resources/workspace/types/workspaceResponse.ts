import { TeamMember, Team, Workspace } from "@prisma/client";

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