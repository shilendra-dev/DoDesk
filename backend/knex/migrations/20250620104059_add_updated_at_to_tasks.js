exports.up = async function(knex) {
  await knex.raw(`
    ALTER TABLE tasks
    ADD COLUMN updated_at TIMESTAMP DEFAULT now();
  `);
};

exports.down = async function(knex) {
  await knex.raw(`
    ALTER TABLE tasks
    DROP COLUMN IF EXISTS updated_at;
  `);
};