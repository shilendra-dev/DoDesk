const express = require("express");
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const {sendEmail} = require('../utils/sendEmail');
const isValidEmail = require("../utils/isValidEmail");


//create workspace api
const createWorkspace = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  if (!name) res.status(401).json({ Message: "Workspace name is required" });

  try {
    //creating workspace and returning it
    const id = uuidv4();
    const newWorkspace = await pool.query(
      `INSERT INTO workspaces (id, name, created_by) VALUES ($1, $2, $3) RETURNING *`,
      [id, name, userId]
    );
    //auto adding creator as member in the workspace_member table
    const memberId = uuidv4();
    await pool.query(
      `INSERT INTO workspace_members (id, workspace_id, user_id, role) VALUES ($1, $2, $3, $4)`,
      [memberId, id, userId, "admin"]
    );

    //setting up default_workspace_id
    const { user } = req.body;
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    await axios.get("http://localhost:5033/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res
      .status(201)
      .json({
        message: "Workspace Successfully Created",
        workspace: newWorkspace.rows[0],
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating workspace" });
  }
};

const getUserWorkspaces = async (req, res) => {
  try {
    const userId = req.user.id;

    const workspaceResult = await pool.query(
      `SELECT w.id, w.name, w.created_at 
            FROM workspaces w
            JOIN workspace_members wm ON w.id = wm.workspace_id
            WHERE wm.user_id = $1`,
      [userId]
    );
    if (workspaceResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No workspaces found for this user" });
    }
    // Respond with the workspaces
    res.json(workspaceResult.rows);
  } catch (err) {
    console.error("Error fetching workspaces:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//INVITE MEMBERS TO WORKSPACE
const inviteMember = async (req, res) => {
    const { workspace_id } = req.params;
    let { email } = req.body;
    const userId = req.user.id;
    email = email.trim().toLowerCase();

    
    //if email is not valid
    
    if(!isValidEmail(email)){
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
        const existingMember = await pool.query(`SELECT * FROM workspace_members WHERE workspace_id = $1 AND user_id = $2`,
        [workspace_id, userId]);
        
        if(existingMember.rows.length > 0){
          return res.status(400).json({message: "User is already a member"})
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
          `SELECT name FROM users WHERE id = $1`, [userId]
        );
        
        sendEmail(`${email}`, `You have been added to the ${workspace_name}`, 'Hey Message from dodesk, you have been added to a new workspace.');

        return res.status(200).json({message: "User added to workspace"});
      }
      else{//USER DOES NOT EXIST ---> SAVE AN INVITATION
        const invitationID = uuidv4();
        await pool.query(
          `INSERT INTO workspace_invitations (id, workspace_id, email) VALUES ($1, $2, $3)`, [invitationID, workspace_id, email]
        );
        
        //SENDING EMAIL
        const workspace_name = await pool.query(
          `SELECT name FROM workspaces WHERE id = $1`,
          [workspace_id]
        );

        const user_name = await pool.query(
          `SELECT name FROM users WHERE id = $1`, [userId]
        );

        sendEmail(`${email}`, `You have been invited to a workspace`, `Hey Message from dodesk, you have been invited to a new workspace ${workspace_name}, please signup to join http://localhost:5173/`);

        return res.status(200).json({message: "Invitation Successfully Sent"});
      }
      
    } catch (error) {
      console.error("Error inviting member:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
module.exports = { createWorkspace, getUserWorkspaces, inviteMember };
