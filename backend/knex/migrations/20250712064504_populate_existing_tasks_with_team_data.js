/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(`
        -- Create a default team for each workspace that has tasks but no teams
        INSERT INTO teams (id, workspace_id, name, key, description, color, created_by, created_at)
        SELECT 
            gen_random_uuid() as id,
            w.id as workspace_id,
            'General' as name,
            'GEN' as key,
            'Default team for existing tasks' as description,
            '#6B7280' as color,
            w.created_by as created_by,
            NOW() as created_at
        FROM workspaces w
        WHERE w.id IN (
            SELECT DISTINCT workspace_id 
            FROM tasks 
            WHERE team_id IS NULL
        )
        AND w.id NOT IN (
            SELECT DISTINCT workspace_id 
            FROM teams
        );
        
        -- Assign existing tasks to the default "General" team in each workspace
        UPDATE tasks 
        SET team_id = (
            SELECT t.id 
            FROM teams t 
            WHERE t.workspace_id = tasks.workspace_id 
            AND t.key = 'GEN'
            LIMIT 1
        )
        WHERE team_id IS NULL;
        
        -- Generate issue numbers and identifiers for existing tasks
        WITH numbered_tasks AS (
            SELECT 
                id,
                team_id,
                ROW_NUMBER() OVER (PARTITION BY team_id ORDER BY created_at) as issue_num
            FROM tasks 
            WHERE issue_number IS NULL
        )
        UPDATE tasks 
        SET 
            issue_number = nt.issue_num,
            identifier = (
                SELECT t.key || '-' || nt.issue_num 
                FROM teams t 
                WHERE t.id = nt.team_id
            )
        FROM numbered_tasks nt
        WHERE tasks.id = nt.id;
        
        -- Now add the unique constraint
        ALTER TABLE tasks ADD CONSTRAINT unique_issue_number_per_team 
        UNIQUE (team_id, issue_number);
        
        -- Make team_id required for future tasks
        ALTER TABLE tasks ALTER COLUMN team_id SET NOT NULL;
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.raw(`
        -- Remove constraints
        ALTER TABLE tasks DROP CONSTRAINT IF EXISTS unique_issue_number_per_team;
        ALTER TABLE tasks ALTER COLUMN team_id DROP NOT NULL;
        
        -- Clear the populated data
        UPDATE tasks SET 
            issue_number = NULL,
            identifier = NULL,
            team_id = NULL;
            
        -- Remove default teams (be careful with this)
        DELETE FROM teams WHERE key = 'GEN' AND description = 'Default team for existing tasks';
    `);
};