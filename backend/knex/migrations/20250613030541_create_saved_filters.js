/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.raw(`
        CREATE TABLE saved_filters (
            id UUID PRIMARY KEY,
            user_id UUID NOT NULL,
            workspace_id UUID NOT NULL,
            name VARCHAR(255) NOT NULL,
            filter_config JSONB NOT NULL,
            is_default BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            
            -- Foreign key constraints
            CONSTRAINT fk_user
                FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE,
                
            CONSTRAINT fk_workspace
                FOREIGN KEY (workspace_id)
                REFERENCES workspaces(id)
                ON DELETE CASCADE,
                
            -- Indexes
            CONSTRAINT idx_user_workspace
                UNIQUE (user_id, workspace_id, name)
        );

        -- Create additional indexes
        CREATE INDEX idx_saved_filters_default ON saved_filters(is_default);
        CREATE INDEX idx_saved_filters_user ON saved_filters(user_id);
        CREATE INDEX idx_saved_filters_workspace ON saved_filters(workspace_id);
        
        -- Create updated_at trigger
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ language 'plpgsql';

        CREATE TRIGGER update_saved_filters_updated_at
            BEFORE UPDATE ON saved_filters
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.raw(`
        -- Drop trigger first
        DROP TRIGGER IF EXISTS update_saved_filters_updated_at ON saved_filters;
        
        -- Drop the function
        DROP FUNCTION IF EXISTS update_updated_at_column();
        
        -- Drop the table (this will automatically drop indexes and constraints)
        DROP TABLE IF EXISTS saved_filters;
    `);
};
