const express = require("express");
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const { createApi } = require("../utils/router");

//Create a team
const createTeam = async (req, res) => {
    const {name, key, description, color} = req.body;
    const { workspace_id: workspaceId } = req.params;
    const userId = req.user.id;

    if(!name || !key) {
        return {
            status: 400,
            message: "Team name and key are required"
        };
    }

    // Validate team key format (should be uppercase letters, 2-10 chars)
    if(!/^[A-Z]{2,10}$/.test(key.toUpperCase())) {
        return {
            status: 400,
            message: "Team key must be 2-10 uppercase letters"
        };
    }

    // Set default color if not provided
    const finalColor = color || '#6B7280';

    try{
        //Check if user is admin of the workspace
        const workspaceMember =  await pool.query(
            `SELECT role FROM workspace_members WHERE workspace_id = $1 AND user_id = $2`,
            [workspaceId, userId]
        );

        if(workspaceMember.rows.length === 0 || workspaceMember.rows[0].role !== 'admin'){
            return {
                status: 403,
                message: "Only workspace admins can create teams"
            };
        }

        //Create team
        const teamId = uuidv4();
        const team = await pool.query(
            `INSERT INTO teams (id, workspace_id, name, key, description, color, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [teamId, workspaceId, name, key.toUpperCase(), description, finalColor, userId]
        );

        //Add creator/admin to team members
        const membershipId = uuidv4();
        await pool.query(
            `INSERT INTO team_members (id, team_id, user_id, role)
            VALUES ($1, $2, $3, $4)`,
            [membershipId, teamId, userId, 'admin']
        );

        return {
            status: 201,
            message: "Team created successfully",
            team: team.rows[0]
        };
    }catch(error){
        console.error("Error creating team:", error);
        return {
            status: 500,
            message: "Error creating team",
            error: error.message,
        };
    }
};
//API endpoint for creating a team
createApi().post("/workspace/:workspace_id/teams").authSecure(createTeam);


//Get workspace teams
const getWorkspaceTeams = async (req, res) => {
    const { workspace_id: workspaceId } = req.params;
    const userId = req.user.id;

    try{
        //Check if user is member of the workspace
        const workspaceMember = await pool.query(
            `SELECT * FROM workspace_members WHERE workspace_id = $1 AND user_id = $2`,
            [workspaceId, userId]
        )

        if(workspaceMember.rows.length === 0){
            return {
                status: 403,
                message: "You are not authorized to access this workspace"
            };
        }

        //Get teams with member count
        const teams = await pool.query(
            `SELECT t.*,
                COUNT(tm.id) as member_count,
                CASE WHEN utm.user_id IS NOT NULL THEN true ELSE false END as is_member
            FROM teams t
            LEFT JOIN team_members tm ON t.id = tm.team_id
            LEFT JOIN team_members utm ON t.id = utm.team_id AND utm.user_id = $2
            WHERE t.workspace_id = $1
            GROUP BY t.id, utm.user_id
            ORDER BY t.created_at DESC
            `,
            [workspaceId, userId]
        );
        
        return {
            status: 200,
            message: "Teams fetched successfully",
            teams: teams.rows
        };
    }catch(error){
        console.error("Error fetching teams:", error);
        return {
            status: 500,
            message: "Error fetching teams",
            error: error.message
        }
    }
}
//API endpoint for getting workspace teams
createApi().get("/workspace/:workspace_id/teams").authSecure(getWorkspaceTeams);


//Get user's teams
const getUserTeams = async (req, res) => {
    const userId = req.user.id;
    const { workspace_id: workspaceId } = req.params;

    try{
        const teams = await pool.query(
            `SELECT t.*, tm.role, tm.joined_at
             FROM teams t
             JOIN team_members tm ON t.id = tm.team_id
             WHERE tm.user_id = $1 AND t.workspace_id = $2
             ORDER BY tm.joined_at DESC`,
             [userId, workspaceId]
        );
        return {
            status: 200,
            message: "User's teams fetched successfully",
            teams: teams.rows
        };
    }catch(error){
        console.error("Error fetching teams:", error);
        return {
            status: 500,
            message: "Error fetching user's teams",
            error: error.message
        };
    }
}
createApi().get("/workspace/:workspace_id/teams/user").authSecure(getUserTeams);


module.exports = {
    createTeam,
    getWorkspaceTeams,
    getUserTeams
  };