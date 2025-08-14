import { Prisma } from '@prisma/client';

export type UserWithWorkspaces = Prisma.UserGetPayload<{
  include: {
    createdWorkspaces: true;
  };
}>;

export type IssueWithRelations = Prisma.IssueGetPayload<{
  include: {
    creator: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    assignee: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    team: {
      select: {
        key: true;
        name: true;
      };
    };
  };
}>;

export type WorkspaceWithTeams = Prisma.WorkspaceGetPayload<{
  include: {
    teams: true;
  };
}>;