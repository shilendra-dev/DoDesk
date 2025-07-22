const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");
const isValidEmail = require("../utils/isValidEmail");
const { createApi } = require("../utils/router");

//Create User API
const createUser = async (req, res) => {
  const { password, name } = req.body;
  let { email } = req.body;
  email = email.trim().toLowerCase();

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  if (!email) return res.status(400).json({ message: "email is required" });
  if (!password)
    return res.status(400).json({ message: "password is required" });
  if (!name) return res.status(400).json({ message: "name is required" });

  try {
    //if user already exist
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser)
      return {
        status: 401,
        message: "Account already exists",
      };

    //hashPassword
    const hashedPassword = await bcrypt.hash(password, 10);

    //inserting new user in DB
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
      const { workspace_id } = invitation;

      let defaultTeam = await prisma.team.create({
        data: {
          workspaceId: workspace_id,
          key: "GEN", //General team
        },
      });

      if (!defaultTeam) {
        defaultTeam = await prisma.team.create({
          data: {
            name: "General",
            key: "GEN", //General team
            workspaceId: workspace_id,
            color: "#6B7280",
          },
        });
      }
      //Add user to the team
      await prisma.workspaceMember.create({
        data: {
          userId: newUser.id,
          teamId: defaultTeam.id,
          role: "member",
        },
      });

      //update user's invitation status
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

    const { password: _, ...userWithoutPassoword } = newUser;

    return {
      status: 201,
      message: "Account is successfully created!!",
      user: userWithoutPassoword,
    };
  } catch (err) {
      console.error(err.message);
      return {
        status: 500,
        message: "Server error",
      };
  }
};
createApi().post("/users/signup").noAuth(createUser); // for creating a new user

// --- GET CURRENT USER ---
const getCurrentUser = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get user and last active workspace
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        lastActiveWorkspace: true, // include the workspace object if you want
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
createApi().get("/user").authSecure(getCurrentUser); // for getting the current user
