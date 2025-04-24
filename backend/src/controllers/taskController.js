const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

const createTask = async(req, res) => {
    const {title, description, status='pending', priority='mid', due_date, workspace_id} = req.body;

    const created_by = req.user?.id;
    const id = uuidv4();
    
    try{
        const result = await pool.query(
            `INSERT INTO tasks
            (id, title, description, status, priority, due_date, workspace_id, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [id, title, description, status, priority, due_date, workspace_id, created_by]
        );
        res.status(201).json(result.rows[0]);
    }catch(error){
        console.error("Error creating task: ", error);
        res.status(500).json({message: "Faied to create task"})
    }
};

module.exports = {createTask}