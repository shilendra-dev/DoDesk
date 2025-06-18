const pool = require("../config/db");
const { createApi } = require("../utils/router");

//GET ALL SUBTASKS RELATED TO A TASK
const getSubtasks = async (req, res) => {
    try{
        //taking taslkId from request parameters
        const taskId = req.params.taskId;
        
        // Check if taskId is provided
        if(!taskId) {
            // return res.status(400).json({ error: 'Task ID is required' });
            return {
                status: 400,
                message: 'Task ID is required'
            }
        }

        // Fetch subtasks related to the taskId from the database
        const { rows } = await pool.query(`
            SELECT * FROM subtasks WHERE task_id = $1 ORDER BY created_at ASC
            `, [taskId]);

        // Return the subtasks in the response
        //res.json({ subtasks: rows });
        return {
            status: 200,
            message: 'Subtasks fetched successfully',
            subtasks: rows
        };
    }catch (error){
        // Log the error and return a 500 status code
        console.error('Error fetching subtasks:', error);
        
        // Return a 500 status code with an error message
        // res.status(500).json({ error: 'Internal server error' });
        return {
            status: 500,
            message: 'Internal server error',
            error: error.message
        };
    }
}
createApi().get('/tasks/:taskId/subtasks').authSecure(getSubtasks); // for fetching all subtasks related to a task

// CREATE A NEW SUBTASK
const createSubtask = async (req, res) => {
    try{
        //Extracting taskId from req params
        const taskId = req.params.taskId;

        //Extracting title from request body
        const { title } = req.body;

        // Check if taskId and title are provided
        if(!taskId || !title) {
            // return res.status(400).json({ error: 'Task ID and title are required' });
            return {
                status: 400,
                message: 'Task ID and title are required'
            };
        }

        // Insert the new subtask into the database
        const {rows} = await pool.query(`
            INSERT INTO subtasks (task_id, title)
            VALUES ($1, $2)
            RETURNING *
        `, [taskId, title]);
        
        // Check if the insertion was successful
        if (rows.length === 0) {
            // return res.status(500).json({ error: 'Failed to create subtask' });
            return {
                status: 500,
                message: 'Failed to create subtask'
            };
        }

        // Return the newly created subtask in the response
        // res.status(201).json(rows[0]);
        return {
            status: 201,
            message: 'Subtask created successfully',
            subtask: rows[0]
        }
    }catch(error){
        // Log the error and return a 500 status code
        console.error('Error creating subtask:', error);
        
        // Return a 500 status code with an error message
        // res.status(500).json({ error: 'Internal server error' });
        return {
            status: 500,
            message: 'Internal server error',
            error: error.message
        };
    }
}
createApi().post('/tasks/:taskId/subtasks').authSecure(createSubtask); // for creating a new subtask

// UPDATE A SUBTASK
const updateSubtask = async (req, res) => {
    try{
        const { id } = req.params;
        const { title, is_completed } = req.body;

        // Check if id is provided
        if(!id) {
            return {
                status: 400,
                message: 'Subtask ID is required'
            };
        }
        // Check if title or is_completed is provided
        if(title === undefined && is_completed === undefined) {
            return {
                status: 400,
                message: 'Title or completion status is required'
            };
        }

        //update query
        const { rows } = await pool.query(`
            UPDATE subtasks
            SET title = COALESCE($1, title), is_completed = COALESCE($2, is_completed)
            WHERE id = $3 RETURNING *
        `, [title, is_completed, id]);

        // Check if the subtask was found and updated
        if (rows.length === 0) {
            return {
                status: 404,
                message: 'Subtask not found'
            };
        }

        // Return the updated subtask in the response
        // res.status(200).json(rows[0]);
        return {
            status: 200,
            message: 'Subtask updated successfully',
            subtask: rows[0]
        };
    }catch(error){
        // Log the error and return a 500 status code
        console.error('Error updating subtask:', error);
        
        // Return a 500 status code with an error message
        return {
            status: 500,
            message: 'Internal server error',
            error: error.message
        };
    }
}
createApi().put('/subtasks/:id').authSecure(updateSubtask); // for updating a subtask

// DELETE A SUBTASK
const deleteSubtask = async (req, res) => {
    try{
        // Extracting subtask ID from request parameters
        const { id } = req.params;

        // Check if id is provided
        if (!id) {
            return {
                status: 400,
                message: 'Subtask ID is required'
            };
        }

        // Delete the subtask from the database query
        const { rowCount } = await pool.query(`
            DELETE FROM subtasks WHERE id = $1`,
            [id]
        );
        // Check if the subtask was found and deleted
        if (rowCount === 0) {
            return {
                status: 404,
                message: 'Subtask not found'
            };
        }
        // Return a success message
        return {
            status: 200,
            message: 'Subtask deleted successfully'
        };
    }catch(error){
        // Log the error and return a 500 status code
        console.error('Error deleting subtask:', error);
        
        // Return a 500 status code with an error message
        return {
            status: 500,
            message: 'Internal server error',
            error: error.message
        };
    }
}
createApi().delete('/subtasks/:id').authSecure(deleteSubtask); // for deleting a subtask
