import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { createApi } from '../utils/router';
import { 
  LoginRequest, 
  LoginResponse, 
} from '../types/controllers/auth.types';
import { ControllerFunction } from '../types/controllers/base.types';

const loginUser: ControllerFunction<LoginResponse> = async (req) => {
  const { email, password }: LoginRequest = req.body;

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

  try {
    // Query to check if user exists
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase()
      }
    });

    // If user does not exist, return error
    if (!user) {
      return {
        status: 401,
        message: "Invalid credentials"
      };
    }

    const validPassword = await bcrypt.compare(password, user.password);

    // If password is invalid, return error
    if (!validPassword) {
      return {
        status: 401,
        message: "Invalid credentials"
      };
    }

    const workspaces = await prisma.workspace.findMany({
      where: {
        creatorId: user.id
      },
      select: {
        id: true,
        name: true,
        slug: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // If password is valid, generate JWT token
    console.log("User logged in:", user.email);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "30d",
    });

    console.log("Login successful");

    if (!user.lastActiveWorkspaceId) {
      console.log("No last active workspace found for user");
    }

    return {
      status: 200,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastActiveWorkspaceId: user.lastActiveWorkspaceId,
      },
      workspaces
    };

  } catch (err) {
    console.error("Login error:", err);
    return {
      status: 500,
      message: "Server error",
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
};

createApi().post("/login").noAuth(loginUser);