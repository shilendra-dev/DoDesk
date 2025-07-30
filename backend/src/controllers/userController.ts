import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { isValidEmail } from '../utils/isValidEmail';
import { createApi } from '../utils/router';
import { 
  CreateUserRequest, 
  CreateUserResponse, 
  GetCurrentUserResponse
} from '../types/controllers/user.types';
import { 
  ControllerFunction,
  AuthenticatedRequest
} from '../types/controllers/base.types';

// Create User API
const createUser: ControllerFunction<CreateUserResponse> = async (req) => {
  const { password, name } = req.body;
  let { email } = req.body;
  email = email.trim().toLowerCase();

  if (!isValidEmail(email)) {
    return {
      status: 400,
      message: "Invalid email address"
    };
  }

  if (!email) {
    return {
      status: 400,
      message: "Email is required"
    };
  }
  
  if (!password) {
    return {
      status: 400,
      message: "Password is required"
    };
  }
  
  if (!name) {
    return {
      status: 400,
      message: "Name is required"
    };
  }

  try {
    // If user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return {
        status: 401,
        message: "Account already exists",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserting new user in DB
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const invitation = await prisma.workspaceInvitation.findFirst({
      where: {
        email,
        status: "pending",
      },
    });

    if (invitation) {
      // User is invited, automatically add them to the workspace
      const { workspaceId } = invitation;

      let defaultTeam = await prisma.team.create({
        data: {
          workspaceId: workspaceId,
          name: "General",
          key: "GEN", // General team
          color: "#6B7280",
        },
      });
      
      // Add user to the team
      await prisma.teamMember.create({
        data: {
          userId: newUser.id,
          teamId: defaultTeam.id,
          role: "member",
        },
      });

      // Update user's invitation status
      await prisma.workspaceInvitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: "accepted",
        },
      });

      return {
        status: 201,
        message: "User successfully signed up and added to the workspace",
      };
    }

    const { password: _, ...userWithoutPassword } = newUser;

    return {
      status: 201,
      message: "Account is successfully created!!",
      data: {
        user: userWithoutPassword,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: "Server error",
    };
  }
};


// Get Current User
const getCurrentUser: ControllerFunction<GetCurrentUserResponse> = async (req) => {
  const userId = (req as AuthenticatedRequest).user.id;

  try {
    // Get user and last active workspace
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        lastActiveWorkspace: true,
      },
    });

    if (!user) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    return {
      status: 200,
      message: "User fetched successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastActiveWorkspaceId: user.lastActiveWorkspaceId,
        lastActiveWorkspace: user.lastActiveWorkspace,
      },
    };
  } catch (err) {
    console.error("Error fetching user:", err);
    return {
      status: 500,
      message: "Server error",
    };
  }
};

createApi().get("/user").authSecure(getCurrentUser);