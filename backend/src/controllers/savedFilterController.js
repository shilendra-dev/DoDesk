const pool = require("../config/db");
const { v4: uuidv4} = require("uuid");

const savedFilterController = {
    //Get all saved filters for a user in a workspace
    async getSavedFilters(req, res) {
        try{
            const {workspace_id} = req.params;
            const userId = req.user.id;

            const result = await pool.query(
                `SELECT * FROM saved_filters
                WHERE user_id = $1 AND workspace_id = $2
                ORDER BY created_at DESC`,
                [userId, workspace_id]
            );

            res.status(200).json(result.rows);
        } catch (error) {
            console.error("Error fetching saved filters:", error);
            res.status(500).json({error: "Internal server error"});
        }
    },

    //save a new filter
    async saveFilter(req, res) {
        try{
            const {name, filter_config} = req.body;
            const {workspace_id} = req.params;
            const userId = req.user.id;

            const id = uuidv4();
            
            if (!name || !filter_config) {
                return res.status(400).json({ error: "Name and filter configuration are required" });
            }

            //Check if a filter with the same name already exists
            const existingFilter = await pool.query(
                `SELECT * FROM saved_filters
                WHERE user_id = $1 AND workspace_id = $2 AND name = $3`,
                [userId, workspace_id, name]
            );
            if (existingFilter.rows.length >0){
                return res.status(400).json({error: "Filter with this name already exists"});
            }
            //insert the new filter
            const result = await pool.query(
                `INSERT INTO saved_filters (id, user_id, workspace_id, name, filter_config)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *`,
                [id, userId, workspace_id, name, filter_config]
            );
            
            res.status(201).json(result.rows[0]);
        }catch(error){
            console.error("Error saving filter:", error);
            res.status(500).json({error: "Internal server error"});
        }
    },

    //delete a filter
    async deleteFilter(req, res) {
        try{
            const {filter_id} = req.params;
            const userId = req.user.id;

            //check if the filter exists
            const result = await pool.query(
                `DELETE FROM saved_filters
                 WHERE id = $1 AND user_id = $2
                 RETURNING *`,
                 [filter_id, userId]
            );

            if (result.rows.length === 0){
                return res.status(404).json({error: "Filter not found"});
            }

            res.status(200).json({message: "Filter deleted successfully"});
        } catch (error) {
            console.error("Error deleting filter:", error);
            res.status(500).json({error: "Internal server error"});
        }
    },

    //set a filter as default
    async setDefaultFilter(req, res) {
        try{
            const {filter_id} = req.params;
            const {workspace_id} = req.params;
            const userId = req.user.id;

            //starting a transaction
            const client = await pool.connect();
            try{
                await client.query("BEGIN");
                
                //unsetting any existing default filter
                await client.query(
                    `UPDATE saved_filters
                    SET is_default = false
                    WHERE user_id = $1 AND workspace_id = $2`,
                    [userId, workspace_id]
                );

                //setting new default filter
                const result = await client.query(
                    `UPDATE saved_filters
                     SET is_default = true
                     WHERE id = $1 AND user_id = $2
                     RETURNING *
                    `, [filter_id, userId]
                );
                
                if (result.rows.length === 0){
                    await client.query("ROLLBACK");
                    return res.status(404).json({error: "Filter not found"});
                }

                await client.query("COMMIT");
                res.status(200).json(result.rows[0]);
            } catch (error) {
                await client.query("ROLLBACK");
                throw error;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error("Error setting default filter:", error);
            res.status(500).json({error: "Internal server error"});
        }
    },

    //get the default filter for a workspace
    async getDefaultFilter(req, res) {
        try{
            const {workspace_id} = req.params;
            const userId = req.user.id;

            const result = await pool.query(
                `SELECT * FROM saved_filters
                 WHERE user_id = $1 AND workspace_id = $2 AND is_default = true`,
                 [userId, workspace_id]
            );
            if (result.rows.length === 0){
                return res.status(404).json({error: "No default filter found"});
            }

            res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error("Error getting default filter:", error);
            res.status(500).json({error: "Server error"});
        }
    }
       
};

module.exports = savedFilterController;