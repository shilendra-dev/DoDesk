const express = require("express");
const prisma = require("../lib/prisma");
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
        const workspaceMember = await prisma.teamMember.findFirst({
            where: {
                userId: userId,
                team: {
                    workspaceId: workspaceId
                },
                role: 'admin'
            }
        });

        if(!workspaceMember){
            return {
                status: 403,
                message: "Only workspace admins can create teams"
            };
        }

        //Create team
        const team = await prisma.team.create({
            data: {
                workspaceId: workspaceId,
                name: name,
                key: key.toUpperCase(),
                description,
                color: finalColor,
                creatorId: userId,
                members: {
                    create: {
                        userId: userId,
                        role: 'admin'
                    }
                }
            },
            include: {
                members: true
            }
        });

        return {
            status: 201,
            message: "Team created successfully",
            team: team
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
        const workspaceMember = await prisma.teamMember.findFirst({
            where: {
                userId: userId,
                team: {
                    workspaceId: workspaceId
                }
            }
        });

        if(!workspaceMember){
            return {
                status: 403,
                message: "You are not authorized to access this workspace"
            };
        }

        //Get teams with member count
        const teams = await prisma.team.findMany({
            where: {
                workspaceId: workspaceId
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        members: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Transform to match expected format
        const transformedTeams = teams.map(team => ({
            ...team,
            member_count: team._count.members,
            is_member: team.members.some(member => member.userId === userId)
        }));
        
        return {
            status: 200,
            message: "Teams fetched successfully",
            teams: transformedTeams
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
        const teams = await prisma.team.findMany({
            where: {
                workspaceId: workspaceId,
                members: {
                    some: {
                        userId: userId
                    }
                }
            },
            include: {
                members: {
                    where: {
                        userId: userId
                    },
                    select: {
                        role: true,
                        joinedAt: true
                    }
                }
            },
            orderBy: {
                members: {
                    joinedAt: 'desc'
                }
            }
        });

         // Transform to match expected format
         const transformedTeams = teams.map(team => ({
            ...team,
            role: team.members[0]?.role,
            joined_at: team.members[0]?.joinedAt
        }));

        return {
            status: 200,
            message: "User's teams fetched successfully",
            teams: transformedTeams
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