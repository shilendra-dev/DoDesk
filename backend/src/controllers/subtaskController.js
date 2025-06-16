const pool = require("../config/db");

//GET ALL SUBTASKS RELATED TO A TASK
exports.getSubtasks = async (req, res) => {
    try{
        //taking taslkId from request parameters
        const taskId = req.params.taskId;
        // Check if taskId is provided
        if(!taskId) {
            return res.status(400).json({ error: 'Task ID is required' });
        }

        // Fetch subtasks related to the taskId from the database
        const { rows } = await pool.query(`
            SELECT * FROM subtasks WHERE task_id = $1 ORDER BY created_at ASC
            `, [taskId]);

        // Return the subtasks in the response
        res.json({ subtasks: rows });
    }catch (error){
        // Log the error and return a 500 status code
        console.error('Error fetching subtasks:', error);
        
        // Return a 500 status code with an error message
        res.status(500).json({ error: 'Internal server error' });
    }
}

// CREATE A NEW SUBTASK
exports.createSubtask = async (req, res) => {
    try{
        //Extracting taskId from req params
        const taskId = req.params.taskId;

        //Extracting title from request body
        const { title } = req.body;

        // Check if taskId and title are provided
        if(!taskId || !title) {
            return res.status(400).json({ error: 'Task ID and title are required' });
        }

        // Insert the new subtask into the database
        const {rows} = await pool.query(`
            INSERT INTO subtasks (task_id, title)
            VALUES ($1, $2)
            RETURNING *
        `, [taskId, title]);
        
        // Check if the insertion was successful
        if (rows.length === 0) {
            return res.status(500).json({ error: 'Failed to create subtask' });
        }

        // Return the newly created subtask in the response
        res.status(201).json(rows[0]);
    }catch(error){
        // Log the error and return a 500 status code
        console.error('Error creating subtask:', error);
        
        // Return a 500 status code with an error message
        res.status(500).json({ error: 'Internal server error' });
    }
}

// UPDATE A SUBTASK
exports.updateSubtask = async (req, res) => {
    try{
        const { id } = req.params;
        const { title, is_completed } = req.body;

        // Check if id is provided
        if(!id) {
            return res.status(400).json({ error: 'Subtask ID is required' });
        }
        // Check if title or is_completed is provided
        if(title === undefined && is_completed === undefined) {
            return res.status(400).json({ error: 'Title or completion status is required' });
        }

        //update query
        const { rows } = await pool.query(`
            UPDATE subtasks
            SET title = COALESCE($1, title), is_completed = COALESCE($2, is_completed)
            WHERE id = $3 RETURNING *
        `, [title, is_completed, id]);

        // Check if the subtask was found and updated
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Subtask not found' });
        }

        // Return the updated subtask in the response
        res.status(200).json(rows[0]);
    }catch(error){
        // Log the error and return a 500 status code
        console.error('Error updating subtask:', error);
        
        // Return a 500 status code with an error message
        res.status(500).json({ error: 'Internal server error' });
    }
}

// DELETE A SUBTASK
exports.deleteSubtask = async (req, res) => {
    try{
        // Extracting subtask ID from request parameters
        const { id } = req.params;

        // Check if id is provided
        if (!id) {
            return res.status(400).json({ error: 'Subtask ID is required' });
        }

        // Delete the subtask from the database query
        const { rowCount } = await pool.query(`
            DELETE FROM subtasks WHERE id = $1`,
            [id]
        );
        // Check if the subtask was found and deleted
        if (rowCount === 0) {
            return res.status(404).json({ error: 'Subtask not found' });
        }
        // Return a success message
        res.status(200).json({ message: 'Subtask deleted successfully' });
    }catch(error){
        // Log the error and return a 500 status code
        console.error('Error deleting subtask:', error);
        
        // Return a 500 status code with an error message
        res.status(500).json({ error: 'Internal server error' });
    }
}
