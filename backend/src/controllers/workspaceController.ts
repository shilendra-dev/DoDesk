import prisma from '../lib/prisma';
import { sendEmail } from '../utils/sendEmail';
import { isValidEmail } from '../utils/isValidEmail';
import { createApi } from '../utils/router';
import {
  CreateWorkspaceRequest,
  CreateWorkspaceResponse,
  GetUserWorkspacesResponse,
  InviteMemberResponse,
  GetWorkspaceMembersResponse,
  GetWorkspaceDetailsResponse,
  CheckSlugAvailabilityResponse
} from '../types/controllers/workspace.types';
import {
  ControllerFunction,
  AuthenticatedRequest,
  WorkspaceRequest
} from '../types/controllers/base.types';

// CREATE WORKSPACE
const createWorkspace: ControllerFunction<CreateWorkspaceResponse> = async (req) => {
  const { name, slug }: CreateWorkspaceRequest = req.body;
  const userId = (req as AuthenticatedRequest).user.id;

  if (!name) {
    return { status: 400, message: "Workspace name is required" };
  }
  if (!slug) {
    return { status: 400, message: "Workspace URL is required" };
  }

  const cleanSlug = slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+|-+$/g, '');

  if (cleanSlug.length < 3) {
    return { status: 400, message: "Workspace URL must be at least 3 characters long" };
  }
  if (cleanSlug !== slug.toLowerCase().trim()) {
    return { status: 400, message: "Workspace URL can only contain letters, numbers, and hyphens" };
  }

  try {
    const existingWorkspace = await prisma.workspace.findUnique({ where: { slug: cleanSlug } });
    if (existingWorkspace) {
      return { status: 409, message: "This workspace URL is already taken. Please choose a different one." };
    }

    const newWorkspace = await prisma.workspace.create({
      data: {
        name,
        slug: cleanSlug,
        creatorId: userId,
        teams: {
          create: {
            name: 'General',
            key: 'GEN',
            color: '#6B7280',
            members: {
              create: { userId, role: 'admin' }
            }
          }
        }
      },
      include: {
        teams: { include: { members: true } }
      }
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.lastActiveWorkspaceId) {
      await prisma.user.update({
        where: { id: userId },
        data: { lastActiveWorkspaceId: newWorkspace.id }
      });
    }

    return {
      status: 201,
      message: "Workspace Successfully Created",
      workspace: newWorkspace
    };
  } catch (err) {
    return {
      status: 500,
      message: "Error creating workspace",
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
};
createApi().post("/workspace").authSecure(createWorkspace);

// GET ALL WORKSPACES OF A USER
const getUserWorkspaces: ControllerFunction<GetUserWorkspacesResponse> = async (req) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const workspaces = await prisma.workspace.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { teams: { some: { members: { some: { userId } } } } }
        ]
      },
      include: {
        teams: {
          include: {
            members: {
              include: {
                user: { select: { id: true, name: true, email: true } }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (workspaces.length === 0) {
      return { status: 404, message: "No workspaces found for this user", workspaces: [] };
    }
    return { status: 200, message: "Workspaces fetched successfully", workspaces };
  } catch (err) {
    return {
      status: 500,
      message: "Server error",
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
};
createApi().get("/workspaces").authSecure(getUserWorkspaces);

// INVITE MEMBERS TO WORKSPACE
const inviteMember: ControllerFunction<InviteMemberResponse> = async (req) => {
  const { workspace_id } = (req as WorkspaceRequest).params;
  let { email } = req.body;
  const userId = (req as AuthenticatedRequest).user.id;
  email = email.trim().toLowerCase();

  if (!isValidEmail(email)) {
    return { status: 400, message: "Invalid email address" };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const targetUserId = existingUser.id;
      const existingMember = await prisma.teamMember.findFirst({
        where: { userId: targetUserId, team: { workspaceId: workspace_id } }
      });
      if (existingMember) {
        return { status: 400, message: "User is already a member" };
      }

      let defaultTeam = await prisma.team.findFirst({
        where: { workspaceId: workspace_id, key: 'GEN' }
      });
      if (!defaultTeam) {
        defaultTeam = await prisma.team.create({
          data: {
            name: 'General',
            key: 'GEN',
            workspaceId: workspace_id,
            color: '#6B7280'
          }
        });
      }

      await prisma.teamMember.create({
        data: { userId: targetUserId, teamId: defaultTeam.id, role: "member" }
      });

      const workspace = await prisma.workspace.findUnique({ where: { id: workspace_id } });
      const inviter = await prisma.user.findUnique({ where: { id: userId } });

      sendEmail(
        email,
        `You have been added to ${workspace?.name}`,
        "Hey, you have been added to a new workspace."
      );

      return {
        status: 200,
        message: "User added to workspace",
        data: { workspace_name: workspace?.name ?? '', user_name: inviter?.name ?? '' }
      };
    } else {
      await prisma.workspaceInvitation.create({
        data: { email, workspaceId: workspace_id }
      });

      const workspace = await prisma.workspace.findUnique({ where: { id: workspace_id } });
      const inviter = await prisma.user.findUnique({ where: { id: userId } });

      sendEmail(
        email,
        `You have been invited to a workspace`,
        `Hey, you have been invited to a new workspace ${workspace?.name ?? ''}, please signup to join.`
      );

      return {
        status: 200,
        message: "Invitation Successfully Sent",
        data: { workspace_name: workspace?.name ?? '', user_name: inviter?.name ?? '' }
      };
    }
  } catch (error) {
    return {
      status: 500,
      message: "Server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
createApi().post("/workspace/:workspace_id/invite").authSecure(inviteMember);

// GET WORKSPACE MEMBERS
const getWorkspaceMembers: ControllerFunction<GetWorkspaceMembersResponse> = async (req) => {
  const { workspace_id } = (req as WorkspaceRequest).params;
  try {
    const members = await prisma.teamMember.findMany({
      where: { team: { workspaceId: workspace_id } },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    const transformedMembers = members.map(member => ({
      id: member.id,
      user_id: member.user.id,
      name: member.user.name,
      email: member.user.email
    }));

    return {
      status: 200,
      message: "Workspace members fetched successfully",
      data: { members: transformedMembers }
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to fetch workspace members",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
createApi().get("/workspace/:workspace_id/members").authSecure(getWorkspaceMembers);

// SET LAST ACTIVE WORKSPACE
const setLastActiveWorkspace: ControllerFunction<any> = async (req) => {
  const userId = (req as AuthenticatedRequest).user.id;
  const { workspace_id } = req.body;
  try {
    const workspaceCheck = await prisma.teamMember.findFirst({
      where: { userId, team: { workspaceId: workspace_id } }
    });

    if (!workspaceCheck) {
      return { status: 404, message: "Workspace not found or you are not a member" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { lastActiveWorkspaceId: workspace_id }
    });

    return { status: 200, message: "Last active workspace set successfully" };
  } catch (error) {
    return {
      status: 500,
      message: "Server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
createApi().post("/user/set-last-active-workspace").authSecure(setLastActiveWorkspace);

// GET WORKSPACE DETAILS
const getWorkspaceDetails: ControllerFunction<GetWorkspaceDetailsResponse> = async (req) => {
  const { workspace_id } = (req as WorkspaceRequest).params;
  const userId = (req as AuthenticatedRequest).user.id;

  try {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspace_id,
        OR: [
          { creatorId: userId },
          { teams: { some: { members: { some: { userId } } } } }
        ]
      },
      include: {
        teams: {
          include: {
            members: {
              where: { userId },
              select: { role: true }
            }
          }
        }
      }
    });

    if (!workspace) {
      return { status: 404, message: "Workspace not found or you don't have access" };
    }

    let userRole = 'member';
    if (workspace.creatorId === userId) {
      userRole = 'admin';
    } else if (workspace.teams.length > 0 && workspace.teams[0] && workspace.teams[0].members.length > 0) {
      userRole = workspace.teams[0].members[0]?.role || 'member';
    }

    return {
      status: 200,
      message: "Workspace details fetched successfully",
      data: {
        workspace: {
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
          createdAt: workspace.createdAt,
          created_by: workspace.creatorId,
          role: userRole
        }
      }
    };
  } catch (err) {
    return {
      status: 500,
      message: "Server error",
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
};
createApi().get("/workspaces/:workspace_id/details").authSecure(getWorkspaceDetails);

// CHECK SLUG AVAILABILITY
const checkSlugAvailability: ControllerFunction<CheckSlugAvailabilityResponse> = async (req) => {
  const { slug } = (req as WorkspaceRequest).params;

  if (!slug) {
    return {
      status: 400,
      message: "Slug parameter is required",
      available: false,
      slug: ''
    };
  }

  const cleanSlug = slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+|-+$/g, '');

  if (cleanSlug.length < 3) {
    return {
      status: 400,
      message: "Workspace URL must be at least 3 characters long",
      available: false,
      slug: cleanSlug
    };
  }

  try {
    const existingWorkspace = await prisma.workspace.findUnique({ where: { slug: cleanSlug } });
    return {
      status: 200,
      message: "Slug availability checked",
      available: !existingWorkspace,
      slug: cleanSlug
    };
  } catch (err) {
    return {
      status: 500,
      message: "Error checking slug availability",
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
};
createApi().get("/workspaces/check-slug/:slug").authSecure(checkSlugAvailability);

// Optionally export for testing
export {
  createWorkspace,
  getUserWorkspaces,
  inviteMember,
  getWorkspaceMembers,
  setLastActiveWorkspace,
  getWorkspaceDetails,
  checkSlugAvailability
};