const express = require("express");
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendEmail");
const isValidEmail = require("../utils/isValidEmail");
const { createApi } = require("../utils/router");


//create workspace api
// Remove this import - we don't need it anymore
// const { generateUniqueSlug } = require("../utils/slugGenerate");

const createWorkspace = async (req, res) => {
  const { name, slug } = req.body;  // Accept both name and slug
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
    const existingWorkspace = await pool.query(
      `SELECT id FROM workspaces WHERE slug = $1`,
      [cleanSlug]
    );

    if (existingWorkspace.rows.length > 0) {
      return {
        status: 409,
        message: "This workspace URL is already taken. Please choose a different one."
      };
    }

    // Create workspace
    const id = uuidv4();
    const newWorkspace = await pool.query(
      `INSERT INTO workspaces (id, name, slug, created_by) VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, name, cleanSlug, userId]
    );

    // Auto adding creator as member in the workspace_member table
    const memberId = uuidv4();
    await pool.query(
      `INSERT INTO workspace_members (id, workspace_id, user_id, role) VALUES ($1, $2, $3, $4)`,
      [memberId, id, userId, "admin"]
    );

    return {
      status: 201,
      message: "Workspace Successfully Created",
      workspace: newWorkspace.rows[0],
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

createApi().post("/user/:user_id/create-workspace").authSecure(createWorkspace); // create a workspace

//get all workspaces of a user
const getUserWorkspaces = async (req, res) => {
  try {
    const userId = req.user.id;

    const workspaceResult = await pool.query(
      `SELECT w.id, w.name, w.slug, w.created_at 
            FROM workspaces w
            JOIN workspace_members wm ON w.id = wm.workspace_id
            WHERE wm.user_id = $1`,
      [userId]
    );
    if (workspaceResult.rows.length === 0) {
      // return res
      //   .status(404)
      //   .json({ message: "No workspaces found for this user" });
      return {
        status: 404,
        message: "No workspaces found for this user",
        workspaces: []
      }
    }
    // Respond with the workspaces
    return { status: 200, message: "Workspaces fetched successfully", workspaces: workspaceResult.rows };

  } catch (err) {
    console.error("Error fetching workspaces:", err);
    //res.status(500).json({ message: "Server error" });
    return {
      status: 500,
      message: "Server error",
      error: err.message
    }
  }
};
createApi().get("/user/:user_id/workspaces").authSecure(getUserWorkspaces); // get all workspaces of a user

//INVITE MEMBERS TO WORKSPACE
const inviteMember = async (req, res) => {
  const { workspace_id } = req.params;
  let { email } = req.body;
  const userId = req.user.id;
  email = email.trim().toLowerCase();

  //if email is not valid

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    const userResult = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length > 0) {
      //THE USER ALREADY EXISTS IN users --> DIRECTLY ADD THEM
      const userId = userResult.rows[0].id;

      //checking if already a member of workspace
      const existingMember = await pool.query(
        `SELECT * FROM workspace_members WHERE workspace_id = $1 AND user_id = $2`,
        [workspace_id, userId]
      );

      if (existingMember.rows.length > 0) {
        return res.status(400).json({ message: "User is already a member" });
      }

      const memberId = uuidv4();
      await pool.query(
        `INSERT INTO workspace_members (id, workspace_id, user_id, role, joined_at)
           VALUES ($1, $2, $3, $4, NOW())`,
        [memberId, workspace_id, userId, "member"]
      );

      const workspace_name = await pool.query(
        `SELECT name FROM workspaces WHERE id = $1`,
        [workspace_id]
      );

      const user_name = await pool.query(
        `SELECT name FROM users WHERE id = $1`,
        [userId]
      );

      sendEmail(
        `${email}`,
        `You have been added to the ${workspace_name}`,
        "Hey Message from dodesk, you have been added to a new workspace."
      );

      //return res.status(200).json({ message: "User added to workspace" });
      return {
        status: 200,
        message: "User added to workspace",
        workspace_name: workspace_name.rows[0].name,
        user_name: user_name.rows[0].name
      }
    } else {
      //USER DOES NOT EXIST ---> SAVE AN INVITATION
      const invitationID = uuidv4();
      await pool.query(
        `INSERT INTO workspace_invitations (id, workspace_id, email) VALUES ($1, $2, $3)`,
        [invitationID, workspace_id, email]
      );

      //SENDING EMAIL
      const workspace_name = await pool.query(
        `SELECT name FROM workspaces WHERE id = $1`,
        [workspace_id]
      );

      const user_name = await pool.query(
        `SELECT name FROM users WHERE id = $1`,
        [userId]
      );

      sendEmail(
        `${email}`,
        `You have been invited to a workspace`,
        `Hey Message from dodesk, you have been invited to a new workspace ${workspace_name}, please signup to join http://localhost:5173/`
      );

      //return res.status(200).json({ message: "Invitation Successfully Sent" });
      return {
        status: 200,
        message: "Invitation Successfully Sent",
        workspace_name: workspace_name.rows[0].name,
        user_name: user_name.rows[0].name
      }
    }
  } catch (error) {
    console.error("Error inviting member:", error);
    //res.status(500).json({ message: "Server error" });
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
    const result = await pool.query(
      ` SELECT wm.id, wm.user_id, u.name, u.email
      FROM workspace_members wm
      JOIN users u ON wm.user_id = u.id
      WHERE wm.workspace_id = $1`, [workspace_id]
    );
    return {
      status: 200,
      message: "Workspace members fetched successfully",
      members: result.rows
    }
  } catch (error) {
    console.error("Error fetching workspace members:", error);
    //res.status(500).json({ error: "Failed to fetch workspace members" });
    return {
      status: 500,
      message: "Failed to fetch workspace members",
      error: error.message
    }
  }
};
createApi().get("/workspace/:workspace_id/members").authSecure(getWorkspaceMembers); // get all members of a workspace

// set default workspace
const setDefaultWorkspace = async (req, res) => {
  const userId = req.user.id;
  const { workspace_id } = req.body;
  try {
    // Check if the workspace exists and the user is a member
    const workspaceCheck = await pool.query(
      `SELECT * FROM workspace_members WHERE workspace_id = $1 AND user_id = $2`,
      [workspace_id, userId]
    );

    if (workspaceCheck.rows.length === 0) {
      // return res.status(404).json({ message: "Workspace not found or you are not a member" });
      return {
        status: 404,
        message: "Workspace not found or you are not a member"
      }
    }

    // Update user's default_workspace_id
    await pool.query(
      `UPDATE users SET default_workspace_id = $1 WHERE id = $2`,
      [workspace_id, userId]
    );

    // return res.status(200).json({ message: "Default workspace set successfully" });
    return {
      status: 200,
      message: "Default workspace set successfully"
    }
  } catch (error) {
    console.error("Error setting default workspace:", error);
    // res.status(500).json({ message: "Server error" });
    return {
      status: 500,
      message: "Server error",
      error: error.message
    }
  }
}
createApi().post("/user/set-default-workspace").authSecure(setDefaultWorkspace); // set default workspace for a user

const getWorkspaceDetails = async (req, res) => {
  const { workspace_id } = req.params;
  const userId = req.user.id;

  try {
    const workspaceResult = await pool.query(
      `SELECT w.id, w.name, w.slug, w.created_at, w.created_by, wm.role
       FROM workspaces w
       JOIN workspace_members wm ON w.id = wm.workspace_id
       WHERE w.id = $1 AND wm.user_id = $2`,
      [workspace_id, userId]
    );

    if (workspaceResult.rows.length === 0) {
      return {
        status: 404,
        message: "Workspace not found or you don't have access"
      };
    }

    return {
      status: 200,
      message: "Workspace details fetched successfully",
      workspace: workspaceResult.rows[0]
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
  
  // Clean slug same way as createWorkspace
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
    const existingWorkspace = await pool.query(
      `SELECT id FROM workspaces WHERE slug = $1`,
      [cleanSlug]
    );

    return {
      status: 200,
      available: existingWorkspace.rows.length === 0,
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