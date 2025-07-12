// backend/knex/migrations/[timestamp]_create_teams_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(`
        CREATE TABLE teams (
            id UUID PRIMARY KEY,
            workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            key VARCHAR(10) NOT NULL,
            description TEXT,
            color VARCHAR(7) DEFAULT '#6B7280',
            settings JSONB DEFAULT '{}',
            created_by UUID REFERENCES users(id) ON DELETE SET NULL,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now(),
            
            -- Ensure team keys are unique within workspace
            CONSTRAINT unique_team_key_per_workspace UNIQUE (workspace_id, key),
            CONSTRAINT unique_team_name_per_workspace UNIQUE (workspace_id, name)
        );
        
        -- Create indexes for better performance
        CREATE INDEX idx_teams_workspace ON teams(workspace_id);
        CREATE INDEX idx_teams_key ON teams(key);
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.raw(`DROP TABLE IF EXISTS teams;`);
};