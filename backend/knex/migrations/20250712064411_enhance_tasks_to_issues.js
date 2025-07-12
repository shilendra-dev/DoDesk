/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(`
        -- Add team_id column
        ALTER TABLE tasks ADD COLUMN team_id UUID REFERENCES teams(id);
        
        -- Add issue number and identifier columns
        ALTER TABLE tasks ADD COLUMN issue_number INTEGER;
        ALTER TABLE tasks ADD COLUMN identifier VARCHAR(20);
        
        -- Add Linear-style fields
        ALTER TABLE tasks ADD COLUMN labels TEXT[] DEFAULT '{}';
        ALTER TABLE tasks ADD COLUMN estimate INTEGER;
        
        -- Add parent/child relationship for sub-issues
        ALTER TABLE tasks ADD COLUMN parent_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL;
        
        -- Create indexes for better performance
        CREATE INDEX idx_tasks_team ON tasks(team_id);
        CREATE INDEX idx_tasks_identifier ON tasks(identifier);
        CREATE INDEX idx_tasks_issue_number ON tasks(team_id, issue_number);
        
        -- Create unique constraint on team issue numbers (after we populate data)
        -- We'll add this constraint later after populating existing data
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.raw(`
        -- Drop indexes
        DROP INDEX IF EXISTS idx_tasks_team;
        DROP INDEX IF EXISTS idx_tasks_identifier;
        DROP INDEX IF EXISTS idx_tasks_issue_number;
        
        -- Drop columns
        ALTER TABLE tasks DROP COLUMN IF EXISTS team_id;
        ALTER TABLE tasks DROP COLUMN IF EXISTS issue_number;
        ALTER TABLE tasks DROP COLUMN IF EXISTS identifier;
        ALTER TABLE tasks DROP COLUMN IF EXISTS labels;
        ALTER TABLE tasks DROP COLUMN IF EXISTS estimate;
        ALTER TABLE tasks DROP COLUMN IF EXISTS parent_task_id;
    `);
};