/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(`
        -- Add slug column
        ALTER TABLE workspaces ADD COLUMN slug VARCHAR(255);
        
        -- Create index for slug lookups (performance)
        CREATE INDEX idx_workspaces_slug ON workspaces(slug);
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.raw(`
        DROP INDEX IF EXISTS idx_workspaces_slug;
        ALTER TABLE workspaces DROP COLUMN IF EXISTS slug;
    `);
};