const express = require("express");
const prisma = require("../lib/prisma");
const { sendEmail } = require("../utils/sendEmail");
const isValidEmail = require("../utils/isValidEmail");
const { createApi } = require("../utils/router");

const createWorkspace = async (req, res) => {
  const { name, slug } = req.body;  
  const userId = req.user.id;

  // Validation
  if (!name) {
    return {
      status: 400,
      message: "Workspace name is required"
    };
  }

  if (!slug) {
    return {
      status: 400,
      message: "Workspace URL is required"
    };
  }

  // Clean and validate slug format
  const cleanSlug = slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '')  // Only allow letters, numbers, and hyphens
    .replace(/^-+|-+$/g, '');    // Remove leading/trailing hyphens

  if (cleanSlug.length < 3) {
    return {
      status: 400,
      message: "Workspace URL must be at least 3 characters long"
    };
  }

  if (cleanSlug !== slug.toLowerCase().trim()) {
    return {
      status: 400,
      message: "Workspace URL can only contain letters, numbers, and hyphens"
    };
  }

  try {
    // Check if slug is already taken
    const existingWorkspace = await prisma.workspace.findUnique({
      where: { slug: cleanSlug }
    });

    if (existingWorkspace) {
      return {
        status: 409,
        message: "This workspace URL is already taken. Please choose a different one."
      };
    }

    // Create workspace with a default team
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
              create: {
                userId: userId,
                role: 'admin'
              }
            }
          }
        }
      },
      include: {
        teams: {
          include: {
            members: true
          }
        }
      }
    });

    // Set as last active workspace if user doesn't have one
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user.lastActiveWorkspaceId) {
      await prisma.user.update({
        where: { id: userId },
        data: { lastActiveWorkspaceId: newWorkspace.id }
      });
    }

    return {
      status: 201,
      message: "Workspace Successfully Created",
      workspace: newWorkspace,
    };

  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: "Error creating workspace",
      error: err.message
    };
  }
};

createApi().post("/workspace").authSecure(createWorkspace); // create a workspace

//get all workspaces of a user
const getUserWorkspaces = async (req, res) => {
  try {
    const userId = req.user.id;

    const workspaces = await prisma.workspace.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { teams: { some: { members: { some: { userId: userId } } } } }
        ]
      },
      include: {
        teams: {
          include: {
            members: {
              include: {
                user: {
                  select: { id: true, name: true, email: true }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (workspaces.length === 0) {
      return {
        status: 404,
        message: "No workspaces found for this user",
        workspaces: []
      }
    }
    return { 
      status: 200, 
      message: "Workspaces fetched successfully", 
      workspaces: workspaces 
    };

  } catch (err) {
    console.error("Error fetching workspaces:", err);
    return {
      status: 500,
      message: "Server error",
      error: err.message
    }
  }
};
createApi().get("/workspaces").authSecure(getUserWorkspaces); // get all workspaces of a user

//INVITE MEMBERS TO WORKSPACE
const inviteMember = async (req, res) => {
  const { workspace_id } = req.params;
  let { email } = req.body;
  const userId = req.user.id;
  email = email.trim().toLowerCase();

  if (!isValidEmail(email)) {
    return {
      status: 400,
      message: "Invalid email address"
    };
  }

  // CHECK IF USER EXISTS
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      //THE USER ALREADY EXISTS --> DIRECTLY ADD THEM
      const targetUserId = existingUser.id;

      //CHECK IF ALREADY A MEMBER OF THE TEAM
      const existingMember = await prisma.teamMember.findFirst({
        where: {
          userId: targetUserId,
          team: {
            workspaceId: workspace_id
          }
        }
      });

      if (existingMember) {
        return {
          status: 400,
          message: "User is already a member"
        };
      }

      // GET OR CREATE DEFAULT TEAM
      let defaultTeam = await prisma.team.findFirst({
        where: {
          workspaceId: workspace_id,
          key: 'GEN'
        }
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

      // ADD USER TO THE TEAM
      await prisma.teamMember.create({
        data: {
          userId: targetUserId,
          teamId: defaultTeam.id,
          role: "member"
        }
      });

      // GET WORKSPACE DETAILS
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspace_id }
      });

      // GET INVITER DETAILS
      const inviter = await prisma.user.findUnique({
        where: { id: userId }
      });

      // SEND EMAIL
      sendEmail(
        `${email}`,
        `You have been added to ${workspace.name}`,
        "Hey Message from dodesk, you have been added to a new workspace."
      );

      return {
        status: 200,
        message: "User added to workspace",
        workspace_name: workspace.name,
        user_name: inviter.name
      }
    } else {
      //USER DOES NOT EXIST ---> SAVE AN INVITATION
      await prisma.workspaceInvitation.create({
        data: {
          email,
          workspaceId: workspace_id
        }
      });

      //SENDING EMAIL
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspace_id }
      });

      // GET INVITER DETAILS
      const inviter = await prisma.user.findUnique({
        where: { id: userId }
      });

      // SEND EMAIL
      sendEmail(
        `${email}`,
        `You have been invited to a workspace`,
        `Hey Message from dodesk, you have been invited to a new workspace ${workspace.name}, please signup to join http://localhost:5173/`
      );

      return {
        status: 200,
        message: "Invitation Successfully Sent",
        workspace_name: workspace.name,
        user_name: inviter.name
      }
    }
  } catch (error) {
    console.error("Error inviting member:", error);
    return{
      status: 500,
      message: "Server error",
      error: error.message
    }
  }
};
createApi().post("/workspace/:workspace_id/invite").authSecure(inviteMember); // invite a member to a workspace

const getWorkspaceMembers = async (req, res) => {
  const { workspace_id } = req.params;
  try {
    const members = await prisma.teamMember.findMany({
      where: {
        team: {
          workspaceId: workspace_id
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // TRANSFORM TO MATCH EXPECTED FORMAT
    const transformedMembers = members.map(member => ({
      id: member.id,
      user_id: member.user.id,
      name: member.user.name,
      email: member.user.email
    }));

    return {
      status: 200,
      message: "Workspace members fetched successfully",
      members: transformedMembers
    }
  } catch (error) {
    console.error("Error fetching workspace members:", error);
    return {
      status: 500,
      message: "Failed to fetch workspace members",
      error: error.message
    }
  }
};
createApi().get("/workspace/:workspace_id/members").authSecure(getWorkspaceMembers); // get all members of a workspace

// SET LAST ACTIVE WORKSPACE
const setLastActiveWorkspace = async (req, res) => {
  const userId = req.user.id;
  const { workspace_id } = req.body;
  try {
    // CHECK IF THE WORKSPACE EXISTS AND THE USER IS A MEMBER
    const workspaceCheck = await prisma.teamMember.findFirst({
      where: {
        userId: userId,
        team: {
          workspaceId: workspace_id
        }
      }
    });

    if (!workspaceCheck) {
      return {
        status: 404,
        message: "Workspace not found or you are not a member"
      }
    }

    // UPDATE USER'S LAST ACTIVE WORKSPACE ID
    await prisma.user.update({
      where: { id: userId },
      data: { lastActiveWorkspaceId: workspace_id }
    });

    return {
      status: 200,
      message: "Last active workspace set successfully"
    }
  } catch (error) {
    console.error("Error setting last active workspace:", error);
    return {
      status: 500,
      message: "Server error",
      error: error.message
    }
  }
}
createApi().post("/user/set-last-active-workspace").authSecure(setLastActiveWorkspace); // set last active workspace for a user

// GET WORKSPACE DETAILS
const getWorkspaceDetails = async (req, res) => {
  const { workspace_id } = req.params;
  const userId = req.user.id;

  try {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspace_id,
        OR: [
          { creatorId: userId },
          { teams: { some: { members: { some: { userId: userId } } } } }
        ]
      },
      include: {
        teams: {
          include: {
            members: {
              where: { userId: userId },
              select: { role: true }
            }
          }
        }
      }
    });

    if (!workspace) {
      return {
        status: 404,
        message: "Workspace not found or you don't have access"
      };
    }

    // GET USER'S ROLE (EITHER AS CREATOR OR TEAM MEMBER)
    let userRole = 'member';
    if (workspace.creatorId === userId) {
      userRole = 'admin';
    } else if (workspace.teams.length > 0 && workspace.teams[0].members.length > 0) {
      userRole = workspace.teams[0].members[0].role;
    }

    return {
      status: 200,
      message: "Workspace details fetched successfully",
      workspace: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        createdAt: workspace.createdAt,
        created_by: workspace.creatorId,
        role: userRole
      }
    };

  } catch (err) {
    console.error("Error fetching workspace details:", err);
    return {
      status: 500,
      message: "Server error",
      error: err.message
    };
  }
};

createApi().get("/workspaces/:workspace_id/details").authSecure(getWorkspaceDetails);

const checkSlugAvailability = async (req, res) => {
  const { slug } = req.params;
  
  // CLEAN SLUG SAME WAY AS CREATE WORKSPACE
  const cleanSlug = slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+|-+$/g, '');

  if (cleanSlug.length < 3) {
    return {
      status: 400,
      message: "Workspace URL must be at least 3 characters long",
      available: false
    };
  }

  try {
    const existingWorkspace = await prisma.workspace.findUnique({
      where: { slug: cleanSlug }
    });

    return {
      status: 200,
      available: !existingWorkspace,
      slug: cleanSlug
    };

  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: "Error checking slug availability",
      error: err.message
    };
  }
};

createApi().get("/workspaces/check-slug/:slug").authSecure(checkSlugAvailability);