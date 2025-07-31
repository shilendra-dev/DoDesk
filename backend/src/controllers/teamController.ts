import prisma from '../lib/prisma';
import { createApi } from '../utils/router';
import {
  CreateTeamResponse,
  GetWorkspaceTeamsResponse,
  GetUserTeamsResponse,
  CreateTeamRequest
} from '../types/controllers/team.types';
import { 
  ControllerFunction,
  AuthenticatedRequest,
  WorkspaceRequest
} from '../types/controllers/base.types';

// CREATE A TEAM
const createTeam: ControllerFunction<CreateTeamResponse> = async (req) => {
  const { name, key, description, color }: CreateTeamRequest = req.body;
  const { workspace_id: workspaceId } = (req as WorkspaceRequest).params;
  const userId = (req as AuthenticatedRequest).user.id;

  if (!name || !key) {
    return {
      status: 400,
      message: "Team name and key are required"
    };
  }

  // Validate team key format (should be uppercase letters, 2-10 chars)
  if (!/^[A-Z]{2,10}$/.test(key.toUpperCase())) {
    return {
      status: 400,
      message: "Team key must be 2-10 uppercase letters"
    };
  }

  // Set default color if not provided
  const finalColor = color || '#6B7280';

  try {
    // Check if user is admin of the workspace
    const workspaceMember = await prisma.teamMember.findFirst({
      where: {
        userId: userId,
        team: {
          workspaceId: workspaceId
        },
        role: 'admin'
      }
    });

    if (!workspaceMember) {
      return {
        status: 403,
        message: "Only workspace admins can create teams"
      };
    }

    // Create team
    const team = await prisma.team.create({
      data: {
        workspaceId: workspaceId,
        name: name,
        key: key.toUpperCase(),
        description: description || null,
        color: finalColor,
        creatorId: userId,
        members: {
          create: {
            userId: userId,
            role: 'admin'
          }
        }
      },
      include: {
        members: true
      }
    });

    return {
      status: 201,
      message: "Team created successfully",
      data: { team }
    };
  } catch (error) {
    console.error("Error creating team:", error);
    return {
      status: 500,
      message: "Error creating team",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

createApi().post("/workspace/:workspace_id/teams").authSecure(createTeam);

// GET WORKSPACE TEAMS
const getWorkspaceTeams: ControllerFunction<GetWorkspaceTeamsResponse> = async (req) => {
  const { workspace_id: workspaceId } = (req as WorkspaceRequest).params;
  const userId = (req as AuthenticatedRequest).user.id;

  try {
    // Check if user is member of the workspace
    const workspaceMember = await prisma.teamMember.findFirst({
      where: {
        userId: userId,
        team: {
          workspaceId: workspaceId
        }
      }
    });

    if (!workspaceMember) {
      return {
        status: 403,
        message: "You are not authorized to access this workspace"
      };
    }

    // Get teams with member count
    const teams = await prisma.team.findMany({
      where: {
        workspaceId: workspaceId
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            members: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const transformedTeams = teams.map(team => {
      const transformedMembers = team.members.map(member => {
        return {
          id: member.id,
          userId: member.userId,
          teamId: member.teamId,
          role: member.role,
          joinedAt: member.joinedAt,
          updatedAt: member.updatedAt,
          user: {
            id: member.user.id,
            name: member.user?.name,
            email: member.user?.email
          }
        };
      });
    
      return {
        ...team,
        members: transformedMembers,
        member_count: team._count.members,
        is_member: team.members.some(member => member.userId === userId)
      };
    });

    return {
      status: 200,
      message: "Teams fetched successfully",
      teams: transformedTeams 
    };
  } catch (error) {
    console.error("Error fetching teams:", error);
    return {
      status: 500,
      message: "Error fetching teams",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

createApi().get("/workspace/:workspace_id/teams").authSecure(getWorkspaceTeams);

// GET USER'S TEAMS
const getUserTeams: ControllerFunction<GetUserTeamsResponse> = async (req) => {
  const userId = (req as AuthenticatedRequest).user.id;
  const { workspace_id: workspaceId } = (req as WorkspaceRequest).params;

  try {
    const teams = await prisma.team.findMany({
      where: {
        workspaceId: workspaceId,
        members: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        members: {
          where: {
            userId: userId
          },
          select: {
            role: true,
            joinedAt: true
          }
        }
      }
    });

    // Transform to match expected format
    const transformedTeams = teams.map(team => {
      const member = team.members[0];
      return {
        ...team,
        role: member?.role || 'member',
        joined_at: member?.joinedAt || new Date()
      };
    }).sort((a, b) => {
      // Sort by joined_at descending
      return new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime();
    });

    return {
      status: 200,
      message: "User's teams fetched successfully",
      teams: transformedTeams
    };
  } catch (error) {
    console.error("Error fetching teams:", error);
    return {
      status: 500,
      message: "Error fetching user's teams",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

createApi().get("/workspace/:workspace_id/teams/user").authSecure(getUserTeams);

// Export for testing
export {
  createTeam,
  getWorkspaceTeams,
  getUserTeams
};