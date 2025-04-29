const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const isValidEmail = require("../utils/isValidEmail");

//Create User API
const createUser = async (req, res) => {
  const { password, name } = req.body;
  let {email} = req.body;
  email = email.trim().toLowerCase();
  
  
  if(!isValidEmail(email)){
    return res.status(400).json({ message: "Invalid email address" });
  }

  if (!email) return res.status(400).json({ message: "email is required" });
  if (!password) return res.status(400).json({ message: "password is required" });
  if (!name) return res.status(400).json({ message: "name is required" });


  try {
    //if user already exist
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userCheck.rows.length > 0)
      return res.status(401).json({ message: "Account already exists" });

    //hashPassword
    const hashedPassword = await bcrypt.hash(password, 10);
    //generating uuid
    const userId = uuidv4();

    //inserting new user in DB
    const newUser = await pool.query(
      "INSERT INTO users (id, email, password, name) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, email, hashedPassword, name]
    );

    const invitation = await pool.query(
      `SELECT * FROM workspace_invitations WHERE email = $1 AND status = 'pending'`,
      [email]
    );

    if (invitation.rows.length > 0) {
      // User is invited, automatically add them to the workspace
      const { workspace_id } = invitation.rows[0];

      const memberId = uuidv4();
      await pool.query(
        `INSERT INTO workspace_members (id, workspace_id, user_id, role, joined_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [memberId, workspace_id, newUser.rows[0].id, "member"]
      );

      // Update the invitation status to accepted
      await pool.query(
        `UPDATE workspace_invitations SET status = 'accepted' WHERE email = $1 AND workspace_id = $2`,
        [email, workspace_id]
      );

      return res
        .status(201)
        .json({
          message: "User successfully signed up and added to the workspace",
        });
    }

    const { password: _, ...userWithoutPassoword } = newUser.rows[0];
    res
      .status(201)
      .json({
        message: "Account is successfully created!!",
        user: userWithoutPassoword,
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// --- GET CURRENT USER + SET DEFAULT WORKSPACE ---
const getCurrentUser = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get user
    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    let user = userResult.rows[0];

    // Check if default_workspace_id is already set
    if (!user.default_workspace_id) {
      // Get first workspace the user is a member of
      const workspaceResult = await pool.query(
        `SELECT workspace_id FROM workspace_members WHERE user_id = $1 ORDER BY joined_at ASC LIMIT 1`,
        [userId]
      );

      const workspace =
        workspaceResult.rows.length > 0 ? workspaceResult.rows[0] : null;

      if (workspace && workspace.workspace_id) {
        // 4. Update user's default_workspace_id
        await pool.query(
          `UPDATE users SET default_workspace_id = $1 WHERE id = $2`,
          [workspace.workspace_id, userId]
        );

        user.default_workspace_id = workspace.workspace_id;
      } else {
        user.default_workspace_id = null;
      }
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createUser,
  getCurrentUser,
};
