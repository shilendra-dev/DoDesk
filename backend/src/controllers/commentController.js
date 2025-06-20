const pool = require("../config/db");
const { createApi } = require("../utils/router");

//get comments related to a task
const getComments = async (req, res) => {
    try{
        // Extracting taskId from request parameters
        const {taskId} = req.params;
        
        // Check if taskId is provided
        if(!taskId) {
            //return res.status(400).json({ error: 'Task ID is required' });
            return {
                status: 400,
                message: 'Task ID is required'
            }
        }
        // Fetch comments related to the taskId from the database
        const {rows} = await pool.query(
            `
            SELECT comments.*, users.name AS user_name
            FROM comments
            LEFT JOIN users ON comments.user_id = users.id
            WHERE comments.task_id = $1
            ORDER BY comments.created_at ASC
            `, [taskId]
        );

        //Return the comments in the response
        //res.status(200).json(rows);
        return {
            status: 200,
            message: 'Comments fetched successfully',
            comments: rows
        };
    }catch (error) {
        // Log the error and return a 500 status code
        console.error('Error fetching comments:', error);
        
        // Return a 500 status code with an error message
        //res.status(500).json({ error: 'Internal server error' });
        return {
            status: 500,
            message: 'Internal server error',
            error: error.message
        };
    }
}
createApi().get('/tasks/:taskId/comments').authSecure(getComments); // for fetching comments related to a task

// CREATE A NEW COMMENT
exports.createComment = async (req, res) => {
    try{
        // Extracting taskId from request parameters
        const {taskId} = req.params;
        // Extracting userId and content from request body
        const { user_id, content, parent_id } = req.body;
    
        // Check if taskId, user_id, and content are provided
        if(!taskId || !user_id || !content) {
            //return res.status(400).json({ error: 'Task ID, User ID, and content are required' });
            return {
                status: 400,
                message: 'Task ID, User ID, and content are required'
            }
        }

        // Insert the new comment into the database query
        const {rows} = await pool.query(
            `
            INSERT INTO comments (task_id, user_id, content, parent_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *    
            `, [taskId, user_id, content, parent_id]
        );

        // Check if the insertion was successful
        if (rows.length === 0) {
            //return res.status(500).json({ error: 'Failed to create comment' });
            return {
                status: 500,
                message: 'Failed to create comment'
            }
        }
        // Return the newly created comment in the response
        //res.status(201).json(rows[0]);
        return {
            status: 201,
            message: 'Comment created successfully',
            comment: rows[0]
        }
    }catch (error) {
        // Log the error and return a 500 status code
        console.error('Error creating comment:', error);
        
        // Return a 500 status code with an error message
        // res.status(500).json({ error: 'Internal server error' });
        return {
            status: 500,
            message: 'Internal server error',
            error: error.message
        };
    }
}
createApi().post('/tasks/:taskId/comments').authSecure(exports.createComment); // for creating a new comment

// UPDATE A COMMENT
exports.updateComment = async (req, res) => {
    try{
        // Extracting commentId from req parameters
        const { id } = req.params;
        // Extracting content from request body
        const { content } = req.body;

        // Check if id is provided
        if(!id || !content) {
            //return res.status(400).json({error : 'Comment ID and content are required'});
            return {
                status: 400,
                message: 'Comment ID and content are required'
            }
        }

        // Update the comment in the database query
        const {rows} = await pool.query(
            `
            UPDATE comments
            SET content = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *
            `, [content, id]
        )
        // Check if the comment was found and updated
        if (rows.length === 0) {
            // return res.status(404).json({ error: 'Comment not found' });
            return {
                status: 404,
                message: 'Comment not found'
            };
        }

        // Return the updated comment in the response
        // res.status(200).json(rows[0]);
        return {
            status: 200,
            message: 'Comment updated successfully',
            comment: rows[0]
        };
    }catch (error) {
        // Log the error and return a 500 status code
        console.error('Error updating comment:', error);

        // Return a 500 status code with an error message
        // res.status(500).json({ error: 'Internal server error' });
        return {
            status: 500,
            message: 'Internal server error',
            error: error.message
        };
    }
}
createApi().put('/comments/:id').authSecure(exports.updateComment); // for updating a comment

// DELETE A COMMENT
exports.deleteComment = async (req, res) => {
    try{
        // Extracting commentId from request parameters
        const { id } = req.params;

        // Checking if id is provided
        if(!id) {
            //return res.status(400).json({ error: 'Comment ID is required' });
            return {
                status: 400,
                message: 'Comment ID is required'
            }
        }

        // Delete the comment from the database query
        const result = await pool.query(
            `
            DELETE FROM comments
            WHERE id = $1
            RETURNING *
            `, [id]
        );

        // Check if the comment was found and deleted
        if (result.rowCount === 0) {
            // return res.status(404).json({ error: 'Comment not found'});
            return {
                status: 404,
                message: 'Comment not found'
            };
        }
        // Return a success message in the response
        // res.status(200).json({ message: 'Comment deleted successfully'});
        return {
            status: 200,
            message: 'Comment deleted successfully',
            comment: result.rows[0]
        };
    }catch(error){
        // Log the error and return a 500 status code
        console.error('Error deleting comment:', error);
        
        // Return a 500 status code with an error message
        // res.status(500).json({ error: 'Internal server error' });
        return {
            status: 500,
            message: 'Internal server error',
            error: error.message
        };
    }
}
createApi().delete('/comments/:id').authSecure(exports.deleteComment); // for deleting a comment