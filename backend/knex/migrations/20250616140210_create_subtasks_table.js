/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.raw(`
        CREATE TABLE subtasks (
        id SERIAL PRIMARY KEY,
        task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        is_completed BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.raw(`
        DROP TABLE IF EXISTS subtasks;
    `)
};
