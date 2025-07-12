/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(`
        CREATE TABLE team_members (
            id UUID PRIMARY KEY,
            team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            role VARCHAR(50) DEFAULT 'member',
            joined_at TIMESTAMP DEFAULT now(),
            
            -- Ensure user can only be in team once
            CONSTRAINT unique_user_per_team UNIQUE (team_id, user_id)
        );
        
        -- Create indexes
        CREATE INDEX idx_team_members_team ON team_members(team_id);
        CREATE INDEX idx_team_members_user ON team_members(user_id);
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.raw(`DROP TABLE IF EXISTS team_members;`);
};