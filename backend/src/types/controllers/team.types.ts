import type { Team, TeamMember } from '../../generated/prisma';

export interface CreateTeamRequest {
  name: string;
  key: string;
  description?: string;
  color?: string;
}

export interface CreateTeamResponse {
  team: Team & {
    members: TeamMember[];
  };
}

export interface GetWorkspaceTeamsResponse {
  teams: Array<Team & {
    members: Array<TeamMember & {
      user: {
        id: string;
        name: string | null;
        email: string;
      };
    }>;
    member_count: number;
    is_member: boolean;
  }>;
}

export interface GetUserTeamsResponse {
  teams: Array<Team & {
    role: string;
    joined_at: Date;
  }>;
}