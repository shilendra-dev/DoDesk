/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    return await knex.raw(`
        CREATE TABLE task_assignees(
        id UUID PRIMARY KEY,
        task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        assigned_at TIMESTAMP DEFAULT now()
    );
    `)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return await knex.raw(`DROP TABLE IF EXISTS task_assignees;`)
  
};
