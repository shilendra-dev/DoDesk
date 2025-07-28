import { createApi } from '../utils/router';
import prisma from '../lib/prisma';
import { ControllerFunction } from '../types/controllers/base.types';
import { AuthenticatedRequest } from '../types/controllers/base.types';

const meRoute: ControllerFunction<any> = async (req) => {
  try {
    const { id } = (req as AuthenticatedRequest).user;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        lastActiveWorkspaceId: true,
      }
    });

    if (!user) {
      return {
        status: 404,
        message: "User not found!"
      };
    }

    return {
      status: 200,
      message: "User fetched successfully",
      data: { user }
    };
  } catch (err) {
    console.error("Error fetching user:", err);
    return {
      status: 500,
      message: "Failed to fetch user",
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
};

createApi().get('/auth/me').authSecure(meRoute); 