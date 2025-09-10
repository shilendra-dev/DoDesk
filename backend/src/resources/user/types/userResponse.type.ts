import { Workspace } from "@prisma/client";

export interface GetCurrentUserResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    lastActiveWorkspaceId: string | null;
    lastActiveWorkspace?: Workspace | null;
  };
}