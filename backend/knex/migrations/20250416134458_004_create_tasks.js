/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    return await knex.raw(`
        CREATE TABLE tasks(
            id UUID PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
            priority TEXT DEFAULT 'mid' CHECK (status IN ('low', 'mid', 'high')),
            due_date DATE,
            workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
            created_by UUID REFERENCES users(id) ON DELETE SET NULL,
            created_at TIMESTAMP DEFAULT now()
        );
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return await knex.raw(`DROP TABLE IF EXISTS tasks;`);
};
