const express = require('express');
const pool = require('../config/db')
const { v4: uuidv4 } = require('uuid');

const createWorkspace = async(req, res) =>{
    const {name} = req.body;
    const userId = req.user.id;

    if(!name) res.status(401).json({Message:"Workspace name is required"});

    try{
        //creating workspace and returning it
        const id = uuidv4();
        const newWorkspace = await pool.query(
            `INSERT INTO workspaces (id, name, created_by) VALUES ($1, $2, $3) RETURNING *`, [id, name, userId]
        );
        //auto adding creator as member in the workspace_member table
        const memberId = uuidv4();
        await pool.query(
            `INSERT INTO workspace_members (id, workspace_id, user_id, role) VALUES ($1, $2, $3, $4)`, [memberId, id, userId, 'admin']
        );
        res.status(201).json({message: "Workspace Successfully Created"})
    }catch(err){
        console.error(err)
        res.status(500).json({message: "Error creating workspace"})
    }
};
module.exports = {createWorkspace};