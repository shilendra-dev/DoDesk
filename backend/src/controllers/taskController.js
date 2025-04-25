const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

//create task or CREATE
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

//fetch task or READ
const getTasksByWorkspace = async(req, res) => {
    const {workspace_id} =  req.params;
    console.log(workspace_id)
    try{
        const result = await pool.query(
            `SELECT * FROM tasks WHERE workspace_id = $1 ORDER BY created_at DESC`, [workspace_id]
        );
        console.log(result.rows)
        res.json(result.rows)
    }catch(error){
        console.log("Error fetching tasks: ", error);
        res.status(500).json({message: "Failed fetching tasks"})
    }
}

//edit task or UPDATE
const updateTask = async(req, res) => {
    const {taskId} = req.params;
    const {title, description, status, priority, due_date} = req.body;

    try{
        const result = pool.query(
            `UPDATE tasks
            SET title = $1, description = $2, status = $3, priority = $4, due_date = $5
            WHERE id = $6 
            RETURNING *`, [title, description, status, priority, due_date, taskId]
        )
        if(result.rows.length ===0){
            return res.status(404).json({message: "Task not found"})
        }
        res.status(200).json(result.rows[0])
    }catch(error){
        console.error("Error updating task: ", error);
        res.status(500).josn({message: "Failed to update tasks"})
    }
};

//delete task or DELETE
const deleteTask = async(req, res) => {
    const {taskId} = req.params;

    try{
        const result = await pool.query(
            `DELETE FROM tasks WHERE id = $1 RETURNING *`, [taskId]
        );
        if(result.rows.length ===0){
            return res.status(404).json({message: "Task not found"})
        }
        res.status(200).json({message: "Task deleted successfully"})
    }catch(error){
        console.error("Error deleting tasks:", error);
        res.status(500).json({message: "Failed to delete task"})
    }
}

module.exports = {createTask, getTasksByWorkspace, updateTask, deleteTask}