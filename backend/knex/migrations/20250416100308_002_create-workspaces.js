/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(`
        CREATE TABLE workspaces
        (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            created_by UUID REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT now()
        );
    `)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.raw(`DROP TABLE IF EXISTS workspaces;`);
};
