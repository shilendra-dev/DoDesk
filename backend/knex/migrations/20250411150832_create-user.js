/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(`create type users_role_enum as enum('admin', 'member')`);
    return knex.raw(`
        CREATE TABLE users (
          id UUID PRIMARY KEY,
          name TEXT,
          email TEXT, 
          password TEXT,
          role users_role_enum,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function(knex) {
      await knex.raw(`DROP TABLE IF EXISTS users;`)
      return knex.raw(`DROP TYPE IF EXISTS users_role_enum;`)
  };
  