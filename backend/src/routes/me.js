const { createApi } = require("../utils/router");
const prisma = require("../lib/prisma");

// GET /auth/me - Get current authenticated user
const meRoute = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        lastActiveWorkspaceId: true,
        // Add more fields if needed
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
      user
    };
  } catch (err) {
    console.error("Error fetching user:", err);
    return {
      status: 500,
      message: "Failed to fetch user",
      error: err.message
    };
  }
};

createApi().get('/auth/me').authSecure(meRoute);